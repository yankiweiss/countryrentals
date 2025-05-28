const path = require("path");
const Listing = require("../model/Listing");
const fs = require("fs");

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
    const files = req.files; // may be an object or array
    const uploadedFiles = [];

    Object.keys(files).forEach((key) => {
      const filePath = path.join(__dirname, "files", files[key].name);
      files[key].mv(filePath);
    });

    const newListing = await Listing.create({
      address: req.body.address,
      baths: req.body.baths,
      bedrooms: req.body.bedrooms,
      description: req.body.description,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      tag: req.body.tag,
      uploadedFiles: uploadedFiles, // save uploaded filenames array here
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res
      .status(500)
      .json({ message: "Error creating listing", error: error.message });
  }
};

module.exports = {
  getAllListing,
  createNewListing,
};
