const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports = {
    // GET /listings — with optional ?category= or ?page= filter
    index: async (req, res) => {
        const { category } = req.query;
        let filter = {};
        if (category) {
            filter.category = category;
        }
        const allListing = await Listing.find(filter);

        // Compute average rating for each listing
        const listingsWithRating = await Promise.all(
            allListing.map(async (listing) => {
                const populated = await Listing.findById(listing._id).populate('reviews');
                const reviews = populated.reviews || [];
                const avg = reviews.length
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : null;
                return { listing, avgRating: avg, reviewCount: reviews.length };
            })
        );

        res.render('./listings/index.ejs', { allListing, listingsWithRating, activeCategory: category || null });
    },

    renderNewForm: (req, res) => {
        res.render('./listings/new.ejs');
    },

    showListing: async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate({
            path: 'reviews',
            populate: { path: 'author' }
        }).populate('owner');

        if (!listing) {
            req.flash('error', 'Cannot find that listing!');
            return res.redirect('/listings');
        }

        // Calculate average rating
        const avgRating = listing.reviews.length
            ? (listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length).toFixed(1)
            : null;

        res.render('./listings/show.ejs', { listing, avgRating });
    },

    createListing: async (req, res, next) => {
        const { title, description, price, location, country, category } = req.body;

        const listing = new Listing({
            title,
            description,
            price,
            location,
            country,
            category: category || 'Other',
        });

        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        }

        listing.owner = req.user._id;
        await listing.save();
        req.flash('success', '🎉 Your listing has been added!');
        res.redirect('/listings');
    },

    editListingForm: async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash('error', 'Cannot find that listing!');
            return res.redirect('/listings');
        }
        const originalUrl1 = listing.image.url.replace('/upload', '/upload/w_600,h_400,c_fill');
        res.render('./listings/edit.ejs', { listing, originalUrl1 });
    },

    updateListing: async (req, res) => {
        const { id } = req.params;
        const updates = { ...req.body };
        const listing = await Listing.findByIdAndUpdate(id, updates, { runValidators: true, new: true });
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
            await listing.save();
        }
        req.flash('success', '✅ Listing updated successfully!');
        res.redirect(`/listings/${id}`);
    },

    deleteListing: async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash('success', '🗑️ Listing deleted.');
        res.redirect('/listings');
    },
};