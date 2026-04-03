const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    avatar: {
        url: {
            type: String,
            default: 'https://res.cloudinary.com/dtsifozg9/image/upload/v1738740130/HorizonHub/default-avatar.png'
        },
        filename: {
            type: String,
            default: 'default-avatar'
        }
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 300
    },
    phone: {
        type: String,
        trim: true,
        maxlength: 20
    }
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// Cascade delete listings and reviews when a user is deleted
UserSchema.post('findOneAndDelete', async (user) => {
    if (user) {
        const Listing = require('./listing');
        const Review = require('./review');
        
        // Find user listings and delete them (which triggers the listing delete hook for associated reviews)
        const userListings = await Listing.find({ owner: user._id });
        for (let listing of userListings) {
            await Listing.findByIdAndDelete(listing._id);
        }
        
        // Delete all reviews authored by this user on any listings
        // We should also ideally pull these review IDs from the respective listings, but deleting the review doc is the main step
        await Review.deleteMany({ author: user._id });
    }
});

module.exports = mongoose.model('User', UserSchema);
