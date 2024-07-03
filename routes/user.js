const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
} = require("../controllers/user");

// Create routes for login / register

router.post("/signin", login);
router.post("/signup", createUser);

// router.use(auth);

// Get /users/me
router.get("/me", getCurrentUser);

// Update /users/me
router.patch("/me", updateCurrentUser);

module.exports = router;
