const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({

    address: {
        type : String,
        required : true
    },
    baths: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    tag : {
        type: String,
        required: false
    },
     files: [String],


})

module.exports = mongoose.model('Listing', listingSchema)