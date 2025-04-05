const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const controller = require('../controllers/reviews.js');

// creating the review post rooute
router.post('/', validateReview,isLoggedIn, wrapAsync(controller.postReview));

// deleting the review route
// NOTE: we have to delete the review from the listing model as well as from the review model
router.delete('/:reviewId', isLoggedIn,isReviewAuthor,wrapAsync(controller.deleteReview));
    
module.exports = router;