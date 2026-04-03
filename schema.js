const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required().min(3).max(100).messages({
        'string.min': 'Title must be at least 3 characters.',
        'string.max': 'Title cannot exceed 100 characters.',
        'any.required': 'Title is required.',
    }),
    description: Joi.string().required().min(10).max(2000).messages({
        'string.min': 'Description must be at least 10 characters.',
        'any.required': 'Description is required.',
    }),
    price: Joi.number().required().min(0).messages({
        'number.min': 'Price cannot be negative.',
        'any.required': 'Price is required.',
    }),
    location: Joi.string().required().messages({
        'any.required': 'Location is required.',
    }),
    country: Joi.string().required().messages({
        'any.required': 'Country is required.',
    }),
    category: Joi.string().valid(
        'Trending', 'House', 'Mountain', 'Castle', 'Pool',
        'Camping', 'Farm', 'Boat', 'Arctic', 'Lake', 'Beach', 'Other'
    ).default('Other'),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5).messages({
            'number.min': 'Rating must be between 1 and 5.',
            'number.max': 'Rating must be between 1 and 5.',
            'any.required': 'Rating is required.',
        }),
        comment: Joi.string().required().min(3).max(500).messages({
            'string.min': 'Comment must be at least 3 characters.',
            'any.required': 'Comment is required.',
        }),
    }).required(),
});

module.exports.userProfileSchema = Joi.object({
    username: Joi.string().min(3).max(30).messages({
        'string.min': 'Username must be at least 3 characters.',
        'string.max': 'Username cannot exceed 30 characters.'
    }),
    email: Joi.string().email(),
    bio: Joi.string().allow('').max(300).messages({
        'string.max': 'Bio cannot exceed 300 characters.',
    }),
    phone: Joi.string().allow('').max(20).messages({
        'string.max': 'Phone number cannot exceed 20 characters.',
    }),
});
