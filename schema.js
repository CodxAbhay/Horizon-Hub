const Joi = require('joi');

// now we are making listing schema for the listing model
// module.exports.listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//     }).required(),
// });
 
module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
});



// now we are making review schema for the review model
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
