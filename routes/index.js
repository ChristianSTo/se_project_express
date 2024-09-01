const router = require("express").Router();

const { NOT_FOUND } = require("./errors");

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
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
