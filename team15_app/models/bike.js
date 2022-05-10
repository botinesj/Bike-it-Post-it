/* Student mongoose model */
const mongoose = require("mongoose");

const Bike = mongoose.model("Bike", {
  model: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
  },
  owner: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  purchasedOn: {
    type: String,
    required: true,
  },
  canBuy: {
    type: Boolean,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = { Bike };
