const express = require("express");
const mongoose = require("mongoose");
const { createUser, login } = require("./controllers/user");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// app.use((req, res, next) => {
//   req.user = {
//     _id: "659cb4075db06a2a5528e74d", // paste the _id of the test user created in the previous step
//   };
//   next();
// });

const routes = require("./routes");

app.use(express.json());
app.post("/signup", createUser);
app.post("/signin", login);

// const auth = require("./middlewares/auth");
// app.use(auth);
app.use(routes);

app.listen(PORT, () => {});
