const router = require("express").Router();
const { auth } = require("../middlewares/auth");

const {
  getItems,
  createItem,
  getItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.use(auth);

router.get("/", getItems);
router.get("/:itemId", getItem);

router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
