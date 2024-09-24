const router = require("express").Router();
const { auth } = require("../middlewares/auth");

const {
  getItems,
  createItem,
  getItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.use(auth);
router.get("/:itemId", getItem);

router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
