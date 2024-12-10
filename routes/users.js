const router = require("express").Router();
const { updateProfileValidation } = require("../middlewares/validation");
const { getCurrentUser, updateProfile } = require("../controllers/users");

const { auth } = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateProfileValidation, updateProfile);

module.exports = router;
