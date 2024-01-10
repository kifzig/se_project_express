const router = require("express").Router();

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
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

// Delete
router.delete(":/userId", deleteUser);

module.exports = router;
