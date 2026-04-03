require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const ejsMate = require('ejs-mate');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://kit.fontawesome.com"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://plus.unsplash.com", "https://images.unsplash.com"],
            connectSrc: ["'self'"],
        },
    },
}));

// Rate limiting — max 200 requests per 15 min per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests from this IP, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// HTTP request logger in development
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// ─── Pre-set res.locals defaults (ensures EJS never throws ReferenceError) ───
app.use((req, res, next) => {
    res.locals.currentUser = null;
    res.locals.success = [];
    res.locals.error = [];
    next();
});

// ─── Static Files & View Engine ───────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Method Override ──────────────────────────────────────────────────────────
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// ─── Utilities ────────────────────────────────────────────────────────────────
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require('./models/review.js');
const { isLoggedIn } = require('./middleware.js');

// ─── Database Connection ──────────────────────────────────────────────────────
const dbUrl = process.env.MONGO_URI;

main()
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

// ─── Session Store (MongoDB) ──────────────────────────────────────────────────
const session = require('express-session');
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on('error', function (e) {
    console.error('Session store error:', e);
});

const isProduction = process.env.NODE_ENV === 'production';

const sessionOptions = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: isProduction,
    }
};

// Trust proxy is required for secure cookies behind Render's reverse proxy
app.set('trust proxy', 1);

// ─── Session & Flash ──────────────────────────────────────────────────────────
app.use(session(sessionOptions));
const flash = require('connect-flash');
app.use(flash());

// ─── Passport Authentication ──────────────────────────────────────────────────
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ─── Global Locals (flash + currentUser) ─────────────────────────────────────
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);

// Root route — Landing page
app.get('/', (req, res) => {
    res.render('./listings/home.ejs');
});

// Search route
app.get('/search', wrapAsync(async (req, res, next) => {
    let { query } = req.query;
    if (!query || query.trim() === '') {
        req.flash('error', 'Please enter something to search.');
        return res.redirect('/listings');
    }
    query = query.trim();
    const allListing = await Listing.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
        ],
    });
    res.render('./listings/search.ejs', { allListing, query });
}));

// Book Now page
app.get('/bookings/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('./listings/bookNow.ejs', { listing });
}));

// Confirm booking
app.post('/listings/:id/book', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('./listings/bookingConfirm.ejs', { listing });
}));

// ─── Error Handling ───────────────────────────────────────────────────────────
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found!'));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong!' } = err;
    res.status(statusCode).render('error.ejs', { err });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
