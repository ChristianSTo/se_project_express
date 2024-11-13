const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      imageUrl: Joi.string().uri().required(),
    }),
  }),
  createItem
);

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      avatar: Joi.string().uri().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  loginUser
);

router.get(
  "/:itemId",
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().length(24).hex().required(),
    }),
  }),
  getItem
);

router.delete(
  "/:itemId",
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteItem
);

router.put(
  "/:itemId/likes",
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeItem
);

router.delete(
  "/:itemId/likes",
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeItem
);

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
    userId: Joi.string().hex().length(24).required(),
  }),
});
