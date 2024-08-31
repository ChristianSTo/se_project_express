const router = require("express").Router();

const {
  getItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.get("/:itemId", getItem);

router.post("/", createItem);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);
router.delete("/:itemId", () => {
  console.log("GET items by ID");
});

module.exports = router;
