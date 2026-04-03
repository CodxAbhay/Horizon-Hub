if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// GET /listings — all listings (with optional ?category= filter)
// POST /listings — create new listing
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.createListing));

// GET /listings/new — render create form
router.get('/new', isLoggedIn, listingController.renderNewForm);

// GET /listings/:id — show listing
// PUT /listings/:id — update listing
// DELETE /listings/:id — delete listing
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('image'), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// GET /listings/:id/edit — render edit form
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));

module.exports = router;