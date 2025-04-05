if(process.env.NODE_ENV != "production"){
    console.log("Development mode");
    require('dotenv').config()
}

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn,isOwner, validateListing  } = require('../middleware.js');
const listingController = require('../controllers/listing.js');

// mutler is used for upload files at the given destination
const multer  = require('multer')
const{storage} = require('../cloudConfig.js')
const upload = multer({ storage})

// more compact way of writing the routes using express router.route
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("image"),validateListing,wrapAsync(listingController.createListing))


// Creating new listing route (and put this route before the /:id route) to avoid conflict
router.get('/new', isLoggedIn,listingController.renderNewForm);


router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));


// updating the listing
router.get('/:id/edit', isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));



module.exports = router;