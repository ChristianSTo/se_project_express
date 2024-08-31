const ClothingItem = require("../models/clothingItem");

// GET items (all of them)

const getItems = (req, res) => {
  console.log("IN CONTROLLER");
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

// create an item (POST)
const createItem = (req, res) => {
  // define the properties on the item
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, author: userId })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

// GET one item by ID
const getItem = (req, res) => {
  // define the id
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

// Update one item
const updateItem = (req, res) => {
  // define the id and the attributes
  const { itemId } = req.params;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { name, weather, imageUrl } })
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

// delete one item
const deleteItem = (req, res) => {
  // define the id
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: "Item ID not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, getItem, updateItem, deleteItem };
