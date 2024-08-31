const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  weather: {
    type: String,
    required: [true, "the weather field is required"],
  },

  imageUrl: {
    type: String,
    required: [true, "the image field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: String,
  },
  likes: {
    type: String,
  },
  createAt: {
    type: String,
  },
});

module.exports = mongoose.model("clothing", clothingItem);
