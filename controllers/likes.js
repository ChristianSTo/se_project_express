// const Like = require("../models/like");
const ClothingItem = require("../models/clothingItem");
// const User = require("../models/user");

// add like to an item
const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Valid ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Item ID not found" });
      }
      return res.status(500).send({ message: err.message });
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
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Item ID not found" });
      }
      return res.status(500).send({ message: err.message });
    });

module.exports = { likeItem, dislikeItem };
