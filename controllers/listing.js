const Listing = require('../models/listing');
const RecommendationService = require('../services/recommendationService');

module.exports = {
    index: async(req, res) =>{
        const allListing = await Listing.find({});
        
        // Get personalized recommendations for logged-in users
        let recommendations = [];
        if (req.user) {
            recommendations = await RecommendationService.getRecommendationsForUser(req.user._id, 6);
        }
        
        res.render('./listings/index.ejs',{allListing});
        res.render('./listings/index.ejs',{allListing, recommendations});
    },
    renderNewForm: (req, res) => {
        res.render('./listings/new.ejs');
    },
    showListing: async(req,res) =>{
        const {id} = req.params;
        const listing = await Listing.findById(id).populate({
            path:"reviews",
            populate: {
                path: "author"
            }
        }).populate("owner");
        if(!listing) {
            req.flash('error', 'Cannot find that listing!');
            return res.redirect('/listings');
        }
        
        // Track user activity for recommendations
        if (req.user) {
            await RecommendationService.trackListingView(req.user._id, id);
        }
        
        // Get recommendations for the user
        let recommendations = [];
        if (req.user) {
            recommendations = await RecommendationService.getRecommendationsForUser(req.user._id, 4);
        } else {
            // For non-logged users, show trending listings
            recommendations = await Listing.find({}).sort({ createdAt: -1 }).limit(4);
        }
        
        res.render('./listings/show.ejs',{listing});
        res.render('./listings/show.ejs',{listing, recommendations});
    },

    createListing: async(req, res,next) =>{
        let url = req.file.path;
        let filename = req.file.filename;
        
        const {title, description, price, location, country} = req.body;
        const listing = new Listing({
            title:title,
            description:description,
            image: {
                url: url || "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
                filename: filename || "default.jpg" // Placeholder filename
            },
            price:price,
            location:location,
            country: country
        });
        // console.log(req.user);
        listing.owner = req.user._id;
        await listing.save()
        req.flash('success', 'Added a new listing!');
        res.redirect('/listings');
    
    },
    editListingForm: async(req, res) => {
        const {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing) {
            req.flash('error', 'Cannot find that listing!');
            return res.redirect('/listings');
        }
        let originalUrl = listing.image.url;
        originalUrl1 = originalUrl.replace("/upload", "/upload/w_600,h_400,c_fill");
        res.render('./listings/edit.ejs',{listing, originalUrl1});
    },

    updateListing: async(req, res) => {
        const {id} = req.params;
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        if(typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url, filename};
            await listing.save();
        }
        req.flash('success', 'Updated a listing!');
        res.redirect(`/listings/${id}`);
    },

    deleteListing: async(req, res) => {
        const {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash('success', 'Deleted a listing!');
        res.redirect('/listings');
    },
    
    // renderBookNowListing: ,
    // bookingConfirm: 



};