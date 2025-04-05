const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError.js');
const{reviewSchema,listingSchema} = require('./schema.js');
const Review = require('./models/review.js');



module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async(req,res,next) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// validating the schema using joi
module.exports.validateListing = (req, res, next) => {
    let{error} = listingSchema.validate(req.body);
    if(error) {
        let message = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, message);
    }
    else {
        next();
    }
};
// module.exports.validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body, { abortEarly: false });
    
//     if (error) {
//         const message = error.details.map(el => el.message).join(', ');
//         return next(new ExpressError(400, message));
//     }

//     next();
// };
// module.exports.validateListing = (req, res, next) => {
//     // console.log("Received req.body:", req.body); 

//     // Ensure req.body is properly structured
//     if (!req.body || Object.keys(req.body).length === 0) {
//         return next(new ExpressError(400, "Request body is empty"));
//     }

//     const { error } = listingSchema.validate(req.body, { abortEarly: false });

//     if (error) {
//         const message = error.details.map(el => el.message).join(', ');
//         return next(new ExpressError(400, message));
//     }

//     next();
// };




// validating the review schema for server side - using joi 
module.exports.validateReview = (req, res, next) => {
    let{error} = reviewSchema.validate(req.body);
    if(error) {
        let message = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, message);
    }
    else {
        next();
    }
};


module.exports.isReviewAuthor = async(req,res,next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}