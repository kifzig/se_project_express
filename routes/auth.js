const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/config");

// User registration

router.post("/signup", async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, avatar, email, password: hashedPassword });

    const savedUser = await newUser.save();
    res.status(201).send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send(err.message);
    console.log(err.message);
  }
});

// User Authorization

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, config.TOKEN_SECRET);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
