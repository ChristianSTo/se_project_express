const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  avatar: {
    type: String,
    required: [true, "the Avatar field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },

  email: {
    type: String,
    required: [true, "the Email field is required"],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },

  password: {
    type: String,
    required: [true, "the Password field is required"],
    select: false,
    validate: {
      validator(value) {
        return validator.isStrongPassword(value);
      },
      message: "You must enter a valid email",
    },
  },
});

// provided code in step 3
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Invalid email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user; // now user is available
      });
    });
};

module.exports = mongoose.model("user", userSchema);
