const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CATEGORIES = [
    'Trending', 'House', 'Mountain', 'Castle', 'Pool',
    'Camping', 'Farm', 'Boat', 'Arctic', 'Lake', 'Beach', 'Other'
];

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        url: {
            type: String,
            default: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=80'
        },
        filename: {
            type: String,
            default: 'default'
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: CATEGORIES,
        default: 'Other',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Cascade delete reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing && listing.reviews.length) {
        const Review = require('./review');
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

// Virtual: average rating
listingSchema.virtual('averageRating').get(function () {
    return null; // Populated at query time in controller
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
