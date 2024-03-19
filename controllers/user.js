const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  SUCCESS,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

// CRUD OPERATIONS

// Create

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(INVALID_DATA_ERROR)
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

    res
      .status(SUCCESS)
      .json({ message: "User created successful", data: user });
  } catch (err) {
    // Handle errors
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(INVALID_DATA_ERROR)
        .json({ message: "Requested resource not found", error: err });
    } else if (err.code === 11000) {
      // MongoDB duplicate key error
      return res
        .status(CONFLICT_ERROR)
        .json({ message: "User with this email already exists." });
    }
    return res
      .status(DEFAULT_ERROR)
      .json({ message: "An error has occurred on the server.", error: err });
  }
};

const getUsers = (req, res) => {
  User.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(DEFAULT_ERROR)
        .send({ message: "Error retrieving a list of all users." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)

    .orFail(() => {
      const error = new Error(`User ID ${userId} not found`);
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((item) => res.status(200).send(item))
    .catch((error) => {
      console.error(error);
      if (error.statusCode === NOT_FOUND_ERROR) {
        res.status(NOT_FOUND_ERROR).send(error.message);
      } else if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid data submitted, action not complete." });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Error retrieving user requested." });
      }
    });
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
      console.error(err);
      res.status(401).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { _id, name, email, avatar } = user;
      res.json({ _id, name, email, avatar });
    })
    .catch((error) => {
      console.error(error);
      res.status(DEFAULT_ERROR).json({ message: error });
    });
};

const updateUser = (req, res) => {
  const { userId } = req.params;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { $set: { avatar } })
    .orFail()
    .then((item) => res.status(SUCCESS).send({ data: item }))
    .catch(() => {
      res
        .status(DEFAULT_ERROR)
        .send({ message: "Error updating user, action not complete." });
    });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { avatar, name } = req.body;

  User.findByIdAndUpdate(
    { _id: userId },
    { $set: { avatar, name } },
    { new: true, useFindAndModify: false },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      res.status(SUCCESS).send({ data: updatedUser });
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      res
        .status(DEFAULT_ERROR)
        .send({ message: "Error updating user, action not complete" });
    });
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  getUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
