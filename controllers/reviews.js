const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

module.exports = {
    postReview: async(req, res) => {
        const {id} = req.params;
        const listing = await Listing.findById(id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        listing.reviews.push(review);
        await review.save();
        await listing.save();
        req.flash('success','Added the review!');
        res.redirect(`/listings/${id}`);
    },
    deleteReview: async(req, res) => {
        const {id, reviewId} = req.params;
        await Review.findByIdAndDelete(reviewId);
        const listing = await Listing.findById(id);
        listing.reviews.pull(reviewId);
        await listing.save();
        req.flash('success','Deleted the review!');
        res.redirect(`/listings/${id}`);
    },
}