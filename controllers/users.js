const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config.js");

// create a user (POST)
const createUser = (req, res) => {
  // define the relevant info needed
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already exists" });
      }
      return res.status(DEFAULT).send({ message: "Internal Server Error" });
    });
};

// GET current logged-in user by their token
const getCurrentUser = (req, res) => {
  // define the id
  const userId = req.user._id;
  // const { userId } = req.params;
  console.log(`User ID: ${userId}`);
  console.log(`User Name: ${req.user.name}`);

  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(NOT_FOUND).send({ message: "User not found" });
    });
};

// login one user
const loginUser = (req, res) => {
  // define the relevant info needed
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password must be provided" });
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      // we get the user object if the email and password match
      // (this is pasted from the instructions)
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      // send the token to the server
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "email or password not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(BAD_REQUEST).send({ message: "User not found" });
    });
};

const updateProfile = (req, res) => {
  // define the relevant info needed
  const { name, avatar } = req.body;
  // define the id
  const userId = req.user._id;
  // find the user by their id, then
  // indicate that the name and avatar will be new
  // also set runValidators
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    // change the user's info to the new info
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "data not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Validation Error" });
      }
      return res.status(DEFAULT).send({ message: "Internal Server Error" });
    });
};
module.exports = { createUser, loginUser, getCurrentUser, updateProfile };
