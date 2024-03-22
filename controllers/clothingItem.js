const ClothingItem = require("../models/clothingItem");

const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  SUCCESS,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR).send({ message: "Data is invalid." });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error from createItem." });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESS).send(items))
    .catch(() => {
      res
        .status(DEFAULT_ERROR)
        .send({ message: "Error from getting all items." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findById({ _id: itemId })
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return res.status(FORBIDDEN).send({ message: "Forbidden" });
      }
      return item.deleteOne(() =>
        res
          .status(SUCCESS)
          .send({ message: "You successfully deleted an item." }),
      );
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        // Handle null error
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Item to be deleted does not exist." });
      } else if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Item not found for deletion." });
      } else {
        // Handle other errors
        res.status(DEFAULT_ERROR).send({ message: "Error deleting item." });
      }
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail(() => {
      const { itemId } = req.params;
      const error = new Error(`Clothing item with ID ${itemId} not found`);
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((item) => res.status(SUCCESS).send({ data: item }))
    .catch((error) => {
      if (error.statusCode === NOT_FOUND_ERROR) {
        // Handle null error
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Document was not found, unable to add like." });
      } else if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid data, unable to add like." });
      } else {
        // Handle other errors
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Error adding like to item." });
      }
    });

// router.delete("/:itemId/likes", dislikeItem);
const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail(() => {
      const { itemId } = req.params;
      const error = new Error(`Clothing item with ID ${itemId} not found`);
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((item) => res.status(SUCCESS).send({ data: item }))
    .catch((error) => {
      if (error.statusCode === NOT_FOUND_ERROR) {
        // Handle null error
        res.status(NOT_FOUND_ERROR).send({ message: error.message });
      } else if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Item not found for removing like from item." });
      } else {
        // Handle other errors
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Error removing like from item." });
      }
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
