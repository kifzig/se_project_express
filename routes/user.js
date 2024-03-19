const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  updateUser,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/user");

router.use(auth);

// Get /users/me
router.get("/me", getCurrentUser);

// Update /users/me
router.patch("/me", updateCurrentUser);

// Update
router.put("/:userId", updateUser);

module.exports = router;
