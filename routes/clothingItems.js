const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  itemValidation,
  itemIdValidation,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  getItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.use(auth);
router.get("/:itemId", itemIdValidation, getItem);

router.post("/", itemValidation, createItem);
router.delete("/:itemId", itemIdValidation, deleteItem);

module.exports = router;
