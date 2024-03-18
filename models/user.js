const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "You must enter a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

user.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((u) => {
      if (!u) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, u.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return u; // now user is available
      });
    });
};

// user is the schema
module.exports = mongoose.model("user", user);
