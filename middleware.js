const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError.js');
const { reviewSchema, listingSchema } = require('./schema.js');
const Review = require('./models/review.js');

// ─── Auth Guards ──────────────────────────────────────────────────────────────

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// ─── Validation Middleware ────────────────────────────────────────────────────

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const message = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(400, message));
    }
    next();
};

module.exports.validateProfile = (req, res, next) => {
    const { error } = require('./schema.js').userProfileSchema.validate(req.body.user, { abortEarly: false });
    if (error) {
        const message = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(400, message));
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const message = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(400, message));
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Review not found!');
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};