const express = require('express');
const router = express.Router();
const RecommendationService = require('../services/recommendationService');
const { isLoggedIn } = require('../middleware');
const wrapAsync = require('../utils/wrapAsync');

// Get user recommendations API endpoint
router.get('/api/recommendations', isLoggedIn, wrapAsync(async (req, res) => {
    const limit = parseInt(req.query.limit) || 6;
    const recommendations = await RecommendationService.getRecommendationsForUser(req.user._id, limit);
    res.json({
        success: true,
        recommendations: recommendations
    });
}));

// Get user activity
router.get('/api/activity', isLoggedIn, wrapAsync(async (req, res) => {
    const UserActivity = require('../models/userActivity');
    const activity = await UserActivity.findOne({ user: req.user._id })
        .populate('viewedListings.listing');
    
    res.json({
        success: true,
        activity: activity || { viewedListings: [], searchHistory: [] }
    });
}));

module.exports = router;