const router = require("express").Router();

const { updateUser, getCurrentUser } = require("../controllers/user");

// Returns All Users
// router.get("/", getUsers);

// Returns Single User by Id
//router.get("/:userId", getUser);

// Get /users/me
router.get("/me", getCurrentUser);

// Update
router.put("/:userId", updateUser);

module.exports = router;
