// const Like = require("../models/like");
const ClothingItem = require("../models/clothingItem");

const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("./errors");

// add like to an item
const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Valid ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: "Item ID not found" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });

// delete like from an item
const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Valid ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: "Item ID not found" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });

module.exports = { likeItem, dislikeItem };
