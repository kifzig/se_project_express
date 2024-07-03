const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  SUCCESS,
  UNAUTHORIZED,
  BAD_REQUEST,
  DUPLICATE_ERROR,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

// CRUD OPERATIONS

// CREATE USER

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(DUPLICATE_ERROR)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userData = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    };

    return res
      .status(SUCCESS)
      .json({ message: "User created successful", data: userData });
  } catch (err) {
    // Handle errors
    if (err.name === "ValidationError") {
      return res
        .status(INVALID_DATA_ERROR)
        .json({ message: "Requested resource not found user" });
    }
    return res
      .status(DEFAULT_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((u) => {
      // authentication successful! u is the user variable
      const token = jwt.sign({ _id: u._id }, JWT_SECRET, { expiresIn: "7d" });
      res.send({ token });
    })
    .catch((err) => {
      // authentication error
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).json({ message: "User not found" });
      }
      const { _id, name, email, avatar } = user;
      return res.json({ _id, name, email, avatar });
    })
    .catch((error) => res.status(DEFAULT_ERROR).json({ message: error }));
};

const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { avatar, name } = req.body;

  User.findByIdAndUpdate(
    { _id: userId },
    { avatar, name },
    { new: true, useFindAndModify: false, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      return res.status(SUCCESS).send({ data: updatedUser });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Validation error" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Error updating user, action not complete" });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
