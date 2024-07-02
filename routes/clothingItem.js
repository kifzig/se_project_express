const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
// CRUD

// Read
router.get("/", getItems);

router.use(auth);

// Create
router.post("/", createItem);

// Delete
router.delete("/:itemId", deleteItem);

// Routes for Likes
router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
