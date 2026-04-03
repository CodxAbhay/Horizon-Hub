const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl, isLoggedIn, validateProfile } = require('../middleware.js');
const controller = require('../controllers/users.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

router.route('/signup')
    .get(controller.renderSignupForm)
    .post(wrapAsync(controller.signupUser));

router.route('/login')
    .get(controller.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
        }),
        controller.loginUser
    );

router.get('/logout', controller.logoutUser);

// Username availability check API
router.get('/check-username', wrapAsync(controller.checkUsername));

// Profile routes
router.route('/profile')
    .get(isLoggedIn, wrapAsync(controller.renderProfile))
    .put(isLoggedIn, upload.single('avatar'), validateProfile, wrapAsync(controller.updateProfile))
    .delete(isLoggedIn, wrapAsync(controller.deleteProfile));

router.get('/profile/edit', isLoggedIn, wrapAsync(controller.renderEditProfile));

module.exports = router;