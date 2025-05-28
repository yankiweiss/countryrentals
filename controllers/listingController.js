const path = require("path");
const Listing = require("../model/Listing");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");

// GET all listings
const getAllListing = async (req, res) => {
  try {
    const listings = await Listing.find();
    if (!listings || listings.length === 0) {
      return res.status(204).json({ message: "No listings found!" });
    }
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const createNewListing = async (req, res) => {
  try {
    const files = req.files?.files;
    const uploadedFiles = [];

    if (files) {
      const filesArray = Array.isArray(files) ? files : [files];

      for (const file of filesArray) {
        const result = await cloudinary.uploader.upload(file.tempFilePath || file.tempFilePath || file.data, {
          folder: 'listings'
        });
        uploadedFiles.push(result.secure_url);
      }
    }
    

    const newListing = await Listing.create({
      address: req.body.address,
      baths: req.body.baths,
      bedrooms: req.body.bedrooms,
      description: req.body.description,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      tag: req.body.tag,
      uploadedFiles: uploadedFiles, // Cloudinary URLs
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: "Error creating listing", error: error.message });
  }
};


module.exports = {
  getAllListing,
  createNewListing,
};
