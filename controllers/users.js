const User = require("../models/user");

const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

// GET users (all of them)

const getUsers = (req, res) => {
  console.log("IN CONTROLLER");
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT).send({ message: "Item ID not found" });
    });
};

// create a user (POST)
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(DEFAULT).send({ message: "Item ID not found" });
    });
};

// GET one user by ID
const getUser = (req, res) => {
  // define the id
  const { userId } = req.params;

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

module.exports = { getUsers, createUser, getUser };
