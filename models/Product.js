const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Property "name" must be provided.'],
    },
    price: {
        type: Number,
        required: [true, 'Property "price" must be provided.'],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0.0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    company: {
        type: String,
        //enum: ['ikea', 'liddy', 'caressa', 'marcos'],
        enum: {
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not supported.',
        }
    }
});

module.exports = mongoose.model('Product', ProductSchema);