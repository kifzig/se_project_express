const router = require("express").Router();

const { getUsers, updateUser, getUser } = require("../controllers/user");

// Returns All Users
//router.get("/", getUsers);

// Returns Single User by Id
//router.get("/:userId", getUser);

// Update
router.put("/:userId", updateUser);

module.exports = router;
