const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./user");

const { DEFAULT_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);

router.use("/users", user);

router.use((req, res) => {
  res.status(DEFAULT_ERROR).send({ message: "Requested resource not found" });
});

module.exports = router;
