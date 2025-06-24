const path = require("path");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const Listing = require('../model/Listing');
const { Model } = require("mongoose");


const populateSelectSearch = async (req, res) => {

    try {
        const cities = await Listing.distinct('city');
        res.json(cities);
    }catch(err){
        console.error("Error getting cities", err)
        res.status(500).send('Server Error')
    }
}


module.exports = {populateSelectSearch}