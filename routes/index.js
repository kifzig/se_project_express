const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./user");

const { NOT_FOUND_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);

router.use("/users", user);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Requested resource not found" });
});

module.exports = router;
