const mongoose = require("mongoose");
const validator = require("validator");
// const User = require("../models/user");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
    // "hot", "warm", and "cold" with the enum validator to implement the field
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  // owner - a link to the item author's model of the ObjectId type, a required field

  // likes - a list of users who liked the item, an ObjectId array with a reference to the user modal
});

module.exports = mongoose.model("clothingItems", clothingItem);
