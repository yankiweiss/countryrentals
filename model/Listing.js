const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  street: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },

  baths: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: false,
  },
  tag: {
    type: String,
    required: false,
  },
  uploadedFiles: {
    type: [String],
    required: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },availableFrom: {
    type: Date,
    required: false,
  },availableUntil: {
    type: Date,
    required: false,
  },propertyType: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Listing", listingSchema);
