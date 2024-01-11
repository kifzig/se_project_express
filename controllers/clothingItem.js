const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const owner = req.user._id;
  console.log(owner);

  module.exports.createClothingItem = (req, res) => {
    console.log(req.user._id); // _id will become accessible
  };

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({
    name: name,
    weather: weather,
    imageURL: imageURL,
    owner: owner,
  })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: `Error from createItem`, e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from get items", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail(() => {
      const error = new Error(`Clothing item with ID ${itemId} not found`);
      error.statusCode = 404;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        // Handle null error
        res.status(404).send({ message: error.message });
      } else {
        // Handle other errors
        res.status(500).send({ message: "Error from updateItem", error });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};

// router.put("/:itemId/likes", likeItem);
const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail(() => {
      const error = new Error(`Clothing item with ID ${itemId} not found`);
      error.statusCode = 404;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        // Handle null error
        res.status(404).send({ message: error.message });
      } else {
        // Handle other errors
        res.status(500).send({ message: "Error from likeItem", error });
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
      const error = new Error(`Clothing item with ID ${itemId} not found`);
      error.statusCode = 404;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        // Handle null error
        res.status(404).send({ message: error.message });
      } else {
        // Handle other errors
        res.status(500).send({ message: "Error from dislikeItem", error });
      }
    });

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
