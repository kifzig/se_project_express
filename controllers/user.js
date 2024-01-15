const User = require("../models/user");

const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

// CRUD OPERATIONS

// Create

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA_ERROR)
          .json({ message: "Requested resource not found." });
      }
      return res
        .status(DEFAULT_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
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
    .then((item) => res.status(200).send(item))
    .catch((error) => {
      if (error.statusCode === NOT_FOUND_ERROR) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Requested item not found." });
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

const updateUser = (req, res) => {
  const { userId } = req.params;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { $set: { avatar } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch(() => {
      res
        .status(DEFAULT_ERROR)
        .send({ message: "Error updating user, action not complete." });
    });
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  getUser,
};
