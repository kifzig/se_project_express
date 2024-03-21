const express = require("express");
const mongoose = require("mongoose");
const { createUser, login } = require("./controllers/user");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const cors = require("cors");
app.use(cors());

const routes = require("./routes");

app.use(express.json());
app.post("/signup", createUser);
app.post("/signin", login);

// const auth = require("./middlewares/auth");
// app.use(auth);
app.use(routes);

app.listen(PORT, () => {});
