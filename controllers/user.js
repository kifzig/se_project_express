const User = require("../models/user");

const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

// CRUD OPERATIONS

// Create

const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar } = req.body;

  User.create({ name: name, avatar: avatar })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === Error.CastError) {
        return res
          .status(INVALID_DATA_ERROR)
          .json({ message: "Invalid data passed to database" });
      } else if (err.name === Error.ValidationError) {
        return res
          .status(NOT_FOUND_ERROR)
          .json({ message: "Requested resource not found" });
      } else {
        return res
          .status(DEFAULT_ERROR)
          .json({ message: "An error has occurred on the server." });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from get Users", e });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      res.status(500).send({ message: "Error from get User", e });
    });
};

const updateUser = (req, res) => {
  const { userId } = req.params;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { $set: { avatar } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: "Error from updateUser", e });
    });
};

const deleteUser = (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  User.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res.status(500).send({ message: "Error from deleteUser", e });
    });
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUser,
};
