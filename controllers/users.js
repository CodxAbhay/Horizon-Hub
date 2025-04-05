
const User = require('../models/user.js');


module.exports = {
    // ... other configurations ...
    renderSignupForm: (req, res) => {
        res.render('./users/signup.ejs');
    },

    signupUser: async (req, res) => {
        try{
            const { email, username, password} = req.body;
            const newUser = new User({ email, username});
            const registeredUser = await User.register(newUser,password);
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', 'Welcome to Wanderlust!');
                res.redirect('/listings'); 
            });
        } catch(e) {
            req.flash('error', e.message);
            res.redirect('/signup');
        }
    },

    renderLoginFrom: (req, res) => {
        res.render('./users/login.ejs');
    },

    loginUser: (req, res) => {
        req.flash('success', 'Welcome back to Wanderlust!');
        res.redirect(res.locals.redirectUrl || '/listings');
    },

    logoutUser: (req, res, next) => {
        req.logout((err) =>{
            if(err){
                return next(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('/listings');
        });
    }

};