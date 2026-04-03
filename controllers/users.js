const User = require('../models/user.js');

module.exports = {
    renderSignupForm: (req, res) => {
        res.render('./users/signup.ejs');
    },

    signupUser: async (req, res, next) => {
        try {
            const { email, username, password } = req.body;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                req.flash('success', `👋 Welcome to Horizon Hub, ${registeredUser.username}!`);
                res.redirect('/listings');
            });
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('/signup');
        }
    },

    renderLoginForm: (req, res) => {
        res.render('./users/login.ejs');
    },

    loginUser: (req, res) => {
        req.flash('success', `🎉 Welcome back, ${req.user.username}!`);
        res.redirect(res.locals.redirectUrl || '/listings');
    },

    logoutUser: (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            req.flash('success', '👋 See you soon, Goodbye!');
            res.redirect('/listings');
        });
    },

    checkUsername: async (req, res) => {
        try {
            const { username } = req.query;
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.json({ available: false, message: 'Username is already taken' });
            }
            return res.json({ available: true, message: 'Username is available' });
        } catch (error) {
            console.error('Error checking username:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    renderProfile: async (req, res) => {
        const user = await User.findById(req.user._id);
        const Listing = require('../models/listing');
        const listings = await Listing.find({ owner: user._id });
        res.render('./users/profile.ejs', { user, listings });
    },

    renderEditProfile: async (req, res) => {
        const user = await User.findById(req.user._id);
        res.render('./users/edit.ejs', { user });
    },

    updateProfile: async (req, res) => {
        const { id } = req.user;
        const updatedUser = await User.findByIdAndUpdate(id, { ...req.body.user }, { new: true });
        
        if (typeof req.file !== 'undefined') {
            const url = req.file.path;
            const filename = req.file.filename;
            updatedUser.avatar = { url, filename };
            await updatedUser.save();
        }
        
        req.flash('success', 'Profile updated successfully!');
        res.redirect('/profile');
    },

    deleteProfile: async (req, res, next) => {
        const { id } = req.user;
        await User.findByIdAndDelete(id);
        
        req.logout((err) => {
            if (err) return next(err);
            req.flash('success', 'Your account and all associated data have been deleted.');
            res.redirect('/listings');
        });
    }
};