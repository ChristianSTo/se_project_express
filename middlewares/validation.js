const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const itemValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().uri().required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    avatar: Joi.string().uri().required(),
    password: Joi.string().required(),
  }),
});

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const itemIdValidation = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
  }),
});

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const updateProfileValidation = celebrate({
  params: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().uri().required().custom(validateURL),
  }),
});

module.exports = {
  itemValidation,
  signUpValidation,
  signInValidation,
  itemIdValidation,
  updateProfileValidation,
};
