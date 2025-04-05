const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require('../middleware.js');
const controller = require('../controllers/users.js');

router.route('/signup')
    .get(controller.renderSignupForm)
    .post(wrapAsync(controller.signupUser));


router.route('/login')
    .get(controller.renderLoginFrom)
    .post(
        saveRedirectUrl,
        passport.authenticate(
            'local', 
            { failureFlash: true, 
            failureRedirect: '/login' }
        ),
        controller.loginUser
    );

router.get('/logout', controller.logoutUser);
module.exports = router;