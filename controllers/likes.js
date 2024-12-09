// const Like = require("../models/like");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const DefaultError = require("../errors/DefaultError");
const NotFoundError = require("../errors/NotFoundError");

const { NOT_FOUND } = require("../utils/errors");

// add like to an item
const likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => {
      return next(new NotFoundError("Valid ID not found"));
    })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.statusCode === NOT_FOUND) {
        return next(new NotFoundError("Item ID not found"));
      }
      return next(new DefaultError("Internal Server Error"));
    });

// delete like from an item
const dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      return next(new NotFoundError("Valid ID not found"));
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.statusCode === NOT_FOUND) {
        return next(new NotFoundError("Item ID not found"));
      }
      return next(new DefaultError("Internal Server Error"));
    });

module.exports = { likeItem, dislikeItem };
