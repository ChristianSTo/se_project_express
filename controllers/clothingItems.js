const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const DefaultError = require("../errors/DefaultError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const { NOT_FOUND } = require("../utils/errors");

// GET items (all of them)

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return next(new DefaultError("Internal Server Error"));
    });
};

// create an item (POST)
const createItem = (req, res, next) => {
  // define the properties on the item
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(new DefaultError("Internal Server Error"));
    });
};

// GET one item by ID
const getItem = (req, res, next) => {
  // define the id
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => next(new NotFoundError("Item ID not created")))
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not created"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(new DefaultError("Internal Server Error"));
    });
};

// delete one item
const deleteItem = (req, res, next) => {
  // define the item id
  const { itemId } = req.params;
  // define the user id
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(() => next(new NotFoundError("Item ID not created")))
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        return next(new ForbiddenError("Forbidden: Cannot delete"));
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Succesfully Deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.statusCode === NOT_FOUND) {
        throw next(new NotFoundError("Item not created"));
      }
      return next(new DefaultError("Internal Server Error"));
    });
};

module.exports = { getItems, createItem, getItem, deleteItem };
