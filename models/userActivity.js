const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userActivitySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    viewedListings: [{
        listing: {
            type: Schema.Types.ObjectId,
            ref: 'Listing'
        },
        viewedAt: {
            type: Date,
            default: Date.now
        },
        viewCount: {
            type: Number,
            default: 1
        }
    }],
    searchHistory: [{
        query: String,
        searchedAt: {
            type: Date,
            default: Date.now
        }
    }],
    preferredLocations: [String],
    preferredPriceRange: {
        min: Number,
        max: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
userActivitySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('UserActivity', userActivitySchema);