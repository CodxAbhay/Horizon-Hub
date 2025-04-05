const mongoose = require('mongoose');

// defining the variable so that we do not need to write mongoose.Schema again and again 
const Schema = mongoose.Schema;

// defining the schema for the listing

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String 
    },
    price: Number,
    location: String,
    country: String,
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
});

// creating a post middleware to delete the reviews associated with the listing
// this will run after the listing is deleted
listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing.reviews.length) {
        const Review = require('./review');
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
    

// using this schema we will create a model
const Listing = mongoose.model('Listing', listingSchema);

// exporting the model
module.exports = Listing;
