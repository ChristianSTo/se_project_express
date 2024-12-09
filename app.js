const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");

const {
  signUpValidation,
  signInValidation,
} = require("./middlewares/validation");

const express = require("express");
require("dotenv").config();

const mainRouter = require("./routes/index");
const { createUser, loginUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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

// enable the request logger before all route handlers
app.use(requestLogger);

// set up server crash testing
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// in app.js, create two POST handlers for the /signin and /signup routes.
app.post("/signin", signInValidation, loginUser);
app.post("/signup", signUpValidation, createUser);

// our routes
app.use("/", mainRouter);

// error logger needs to be enabled after the route handlers and before the error handlers:
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is Running: ${PORT}`);
});
