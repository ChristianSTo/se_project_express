const router = require("express").Router();

const NotFoundError = require("../errors/NotFoundError");

router.get("/", (req, res) => {
  res.send("Welcome to the homepage!"); // You can change this to whatever message or content you want
});

// user router
const userRouter = require("./users");

router.use("/users", userRouter);

// item router
const itemRouter = require("./clothingItems");

router.use("/items", itemRouter);

// like router
const likeRouter = require("./likes");

router.use("/items", likeRouter);

router.use((req, res) => {
  return next(new NotFoundError("Valid ID not found"));
});

module.exports = router;
