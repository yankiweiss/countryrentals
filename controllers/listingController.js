const path = require("path");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const Listing = require('../model/Listing')

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
    
    // Save listing with Cloudinary image URLs
    const newListing = await Listing.create({
      address: req.body.address,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      availableFrom: req.body.availableFrom,
      availableUntil: req.body.availableUntil,
      baths: req.body.baths,
      bedrooms: req.body.bedrooms,
      description: req.body.description,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      tag: req.body.tag,
      uploadedFiles: req.body.uploadedFiles,
   
    });

    res.status(201).json({id: newListing._id});
  } catch (error) {
    console.error("Error creating listing:", error);
    res
      .status(500)
      .json({ message: "Error creating listing", error: error.message });
  }
};

const updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing status:", error);
    res
      .status(500)
      .json({
        message: "Failed to update listing status",
        error: error.message,
      });
  }
};

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }


};


const approveListingById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Listing ID is required" });
    }

    const listing = await Listing.findByIdAndUpdate(
      id,
      { status: 'Approved' },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing approved", listing });
  } catch (err) {
    console.error("Error approving listing:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllListing,
  createNewListing,
  updateListingStatus,
  getListingById,
  approveListingById
};
