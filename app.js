const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { createUser, loginUser } = require("./controllers/users");
const { auth } = require("./middlewares/auth");

console.log(mainRouter);

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((evt) => {
    console.error(evt);
  });

app.use(express.json());
app.use(cors());

// in app.js, create two POST handlers for the /signin and /signup routes.
app.post("/signin", loginUser);
app.post("/signup", createUser);

app.use(auth);
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is Running: ${PORT}`);
});
