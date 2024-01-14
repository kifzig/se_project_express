const router = require("express").Router();

const {
  createUser,
  getUsers,
  updateUser,
  getUser,
} = require("../controllers/user");

// Create
router.post("/", createUser);

// Returns All Users
router.get("/", getUsers);

// Returns Single User by Id
router.get("/:userId", getUser);

// Update
router.put("/:userId", updateUser);

module.exports = router;
