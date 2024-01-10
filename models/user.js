const mongoose = require("mongoose");
const validator = require("validator");

// User schema fields
const user = new mongoose.Schema({
  // name - name of the user, a required string from 2 to 30 characters
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // avatar - a required string for the URL of the user's image
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
  },
});

module.exports = mongoose.model("user", user);
