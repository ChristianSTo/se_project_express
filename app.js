const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

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

app.use((req, res, next) => {
  req.user = {
    _id: "66d2a5420bcb6521491ed141", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is Running: ${PORT}`);
});
