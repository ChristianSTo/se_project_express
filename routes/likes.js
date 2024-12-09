const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { itemIdValidation } = require("../middlewares/validation");

const { likeItem, dislikeItem } = require("../controllers/likes");

router.use(auth);

router.put("/:itemId/likes", itemIdValidation, likeItem);
router.delete("/:itemId/likes", itemIdValidation, dislikeItem);

module.exports = router;
