const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./utils/auth");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use(cors());

const routes = require("./routes");

app.use(express.json());
app.use("/signup", authRoutes);
app.use("/signin", authRoutes);

// const auth = require("./middlewares/auth");
// app.use(auth);
app.use(routes);

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
