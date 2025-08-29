require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const RecommendationService = require('./services/recommendationService');
const path = require('path');
const ejsMate = require('ejs-mate');

// for using static files we have to use this line
app.use(express.static(path.join(__dirname, 'public')));

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');

// requiring the schema validation (Joi) from the schema.js file
const{listingSchema ,reviewSchema} = require('./schema.js');

// requiring the review model 
const Review = require('./models/review.js');

// for using ejs views path we have to require path module
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const { isLoggedIn  } = require('./middleware.js');


// to get the data from the form we have to use this line 
app.use(express.urlencoded({ extended: true }));
// to make sure that post request will work properly we have to use this line because express will not understand the post request
app.use(express.json());
// for using the method override [put, delete, patch]
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// requiring the routes from the routes folder
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
// requiring the user routes
const userRouter = require('./routes/user.js');
const recommendationsRouter = require('./routes/recommendations.js');

// using express session for flash messages
const session = require('express-session');
const MongoStore = require('connect-mongo');  // for storing the session in the mongodb atlas


// using the flash package for flash messages
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local'); 
const User = require('./models/user.js');


// using the mongoose to connect to the mongodb atlas 
const dbUrl = process.env.MONGO_URI;


// connect to mongodb atlas
main()
.then(() =>{
    console.log('Connected to MongoDB');
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600, // time in seconds to update the session
    // ttl: 24 * 3600, // time in seconds to expire the session
    
})


store.on("error", function (e) {
    console.log("Session store error", e);
});

// using the express session
const sessionOptions = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // using the session middleware
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true,
    }
};




// using the session middleware
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// using the passport middleware to store the user in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware to show the flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


// here using the router 
app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews',reviewsRouter);
app.use('/', userRouter);
app.use('/', recommendationsRouter);


// root route
app.get('/', (req, res) => {
    res.render('./listings/home.ejs');
});

app.get("/search", async (req, res, next) => {
    try {
        let { query } = req.query;
        if (!query || query.trim() === "") {
            res.render('error.ejs',{err});
        }
        query = query.trim(); // Remove spaces from the input
        
        // Track search for recommendations
        if (req.user) {
            await RecommendationService.trackSearch(req.user._id, query);
        }
        
        const allListing = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, // Case-insensitive search
                { location: { $regex: query, $options: "i" } },
                { country: { $regex: query, $options: "i" } },
            ],
        });
        // Render the 'listings/index' page with results
        res.render("./listings/search.ejs", { allListing, query });
    } catch (error) {
        next(new ExpressError(404,'Did not found any home!'));
    }
}); 

 // renderring BookNow page
app.get('/bookings/:id',isLoggedIn, async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('./listings/bookNow.ejs',{listing});
});

// post method to confirm the booking
app.post('/listings/:id/book', isLoggedIn, async(req, res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('./listings/bookingConfirm.ejs',{listing});
});

// Page not found error handling middleware 
app.all("*", (req, res, next) =>{
    next(new ExpressError(404,'Page not found!'));
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// creating middleware to handle the error
app.use((err,req, res, next) =>{
    let{statusCode=500, message="Somthing went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.render('error.ejs',{err});
});

app.listen(8080, () =>{
    console.log('Server is running on port 8080');
});

