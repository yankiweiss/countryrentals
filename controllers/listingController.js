const path = require('path');
const Listing = require('../model/Listing');

// GET all listings
const getAllListing = async (req, res) => {
  try {
    const listings = await Listing.find();
    if (!listings || listings.length === 0) {
      return res.status(204).json({ message: 'No listings found!' });
    }
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// POST create new listing with optional files
const createNewListing = async (req, res) => {
  try {
    const files = req.files?.files; // `files` is the field name sent from frontend
    const uploadedFiles = [];

    // Handle file uploads
    if (files) {
      const filesArray = Array.isArray(files) ? files : [files];

      for (const file of filesArray) {
        const savePath = path.join(__dirname, '../uploads', file.name);
        await file.mv(savePath);
        uploadedFiles.push(file.name); // store file names, or full paths if you prefer
      }
    }

    // Save listing to DB
    const newListing = await Listing.create({
      address: req.body.address,
      baths: req.body.baths,
      bedrooms: req.body.bedrooms,
      description: req.body.description,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      tag: req.body.tag,
      files: uploadedFiles // optional, only if your schema supports it
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating listing', error });
  }
};

module.exports = {
  getAllListing,
  createNewListing
};