const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const DefaultError = require("../errors/DefaultError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  DEFAULT,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// create a user (POST)
const createUser = (req, res, next) => {
  // define the relevant info needed
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not created");
      }
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      next(new DefaultError("Internal Server Error"));
    });
};

// GET current logged-in user by their token
const getCurrentUser = (req, res, next) => {
  // define the id
  const userId = req.user._id;
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
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

// login one user
const loginUser = (req, res, next) => {
  // define the relevant info needed
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password must be provided"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Incorrect credientials");
      }
      // we get the user object if the email and password match
      // (this is pasted from the instructions)
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      // send the token to the server
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.log(err);
      if (
        err.message === "Invalid email or password" ||
        err.message === "Incorrect email or password"
      ) {
        return next(new UnauthorizedError("Unauthorized credentials"));
      }
      next(new DefaultError("Internal Server Error"));
    });
};

const updateProfile = (req, res, next) => {
  // define the relevant info needed
  const { name, avatar } = req.body;
  // define the id
  const userId = req.user._id;
  // find the user by their id, then
  // indicate that the name and avatar will be new
  // also set runValidators
  return (
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
        if (err.name === "ValidationError") {
          return next(new BadRequestError("Invalid data"));
        }
        next(err);
      })
  );
};
module.exports = { createUser, loginUser, getCurrentUser, updateProfile };
