const Listing = require('../models/listing');
const UserActivity = require('../models/userActivity');
const _ = require('lodash');

class RecommendationService {
    
    // Get recommendations based on user activity
    static async getRecommendationsForUser(userId, limit = 6) {
        try {
            const userActivity = await UserActivity.findOne({ user: userId })
                .populate('viewedListings.listing');
            
            if (!userActivity || userActivity.viewedListings.length === 0) {
                // For new users, return trending/popular listings
                return await this.getTrendingListings(limit);
            }

            const viewedListings = userActivity.viewedListings.map(v => v.listing).filter(Boolean);
            const recommendations = new Set();

            // 1. Location-based recommendations
            const locationRecs = await this.getLocationBasedRecommendations(viewedListings, limit / 2);
            locationRecs.forEach(listing => recommendations.add(listing._id.toString()));

            // 2. Price-based recommendations
            const priceRecs = await this.getPriceBasedRecommendations(viewedListings, limit / 2);
            priceRecs.forEach(listing => recommendations.add(listing._id.toString()));

            // 3. Similar properties (same country)
            const similarRecs = await this.getSimilarProperties(viewedListings, limit / 2);
            similarRecs.forEach(listing => recommendations.add(listing._id.toString()));

            // Convert back to array and get full listing objects
            const recommendationIds = Array.from(recommendations);
            const finalRecommendations = await Listing.find({
                _id: { $in: recommendationIds }
            }).limit(limit);

            // If we don't have enough recommendations, fill with trending
            if (finalRecommendations.length < limit) {
                const trending = await this.getTrendingListings(limit - finalRecommendations.length);
                const existingIds = finalRecommendations.map(l => l._id.toString());
                const additionalRecs = trending.filter(l => !existingIds.includes(l._id.toString()));
                finalRecommendations.push(...additionalRecs);
            }

            return finalRecommendations.slice(0, limit);
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return await this.getTrendingListings(limit);
        }
    }

    // Get location-based recommendations
    static async getLocationBasedRecommendations(viewedListings, limit) {
        const locations = viewedListings.map(listing => listing.location);
        const countries = viewedListings.map(listing => listing.country);
        
        return await Listing.find({
            $or: [
                { location: { $in: locations } },
                { country: { $in: countries } }
            ],
            _id: { $nin: viewedListings.map(l => l._id) }
        }).limit(limit);
    }

    // Get price-based recommendations
    static async getPriceBasedRecommendations(viewedListings, limit) {
        const prices = viewedListings.map(listing => listing.price);
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const priceRange = avgPrice * 0.3; // 30% range

        return await Listing.find({
            price: {
                $gte: avgPrice - priceRange,
                $lte: avgPrice + priceRange
            },
            _id: { $nin: viewedListings.map(l => l._id) }
        }).limit(limit);
    }

    // Get similar properties (same country, similar price range)
    static async getSimilarProperties(viewedListings, limit) {
        const countries = [...new Set(viewedListings.map(listing => listing.country))];
        
        return await Listing.find({
            country: { $in: countries },
            _id: { $nin: viewedListings.map(l => l._id) }
        }).limit(limit);
    }

    // Get trending/popular listings for new users
    static async getTrendingListings(limit) {
        return await Listing.find({})
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    // Track user activity when viewing a listing
    static async trackListingView(userId, listingId) {
        try {
            if (!userId) return;

            let userActivity = await UserActivity.findOne({ user: userId });
            
            if (!userActivity) {
                userActivity = new UserActivity({
                    user: userId,
                    viewedListings: []
                });
            }

            // Check if listing already viewed
            const existingView = userActivity.viewedListings.find(
                v => v.listing && v.listing.toString() === listingId.toString()
            );

            if (existingView) {
                existingView.viewCount += 1;
                existingView.viewedAt = new Date();
            } else {
                userActivity.viewedListings.push({
                    listing: listingId,
                    viewedAt: new Date(),
                    viewCount: 1
                });
            }

            // Keep only last 50 viewed listings
            if (userActivity.viewedListings.length > 50) {
                userActivity.viewedListings = userActivity.viewedListings
                    .sort((a, b) => b.viewedAt - a.viewedAt)
                    .slice(0, 50);
            }

            await userActivity.save();
        } catch (error) {
            console.error('Error tracking listing view:', error);
        }
    }

    // Track search queries
    static async trackSearch(userId, query) {
        try {
            if (!userId || !query) return;

            let userActivity = await UserActivity.findOne({ user: userId });
            
            if (!userActivity) {
                userActivity = new UserActivity({
                    user: userId,
                    searchHistory: []
                });
            }

            userActivity.searchHistory.push({
                query: query.trim(),
                searchedAt: new Date()
            });

            // Keep only last 20 searches
            if (userActivity.searchHistory.length > 20) {
                userActivity.searchHistory = userActivity.searchHistory
                    .sort((a, b) => b.searchedAt - a.searchedAt)
                    .slice(0, 20);
            }

            await userActivity.save();
        } catch (error) {
            console.error('Error tracking search:', error);
        }
    }
}

module.exports = RecommendationService;