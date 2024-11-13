const errorHandler = (err, req, res, next) => {
  // this is the error handler
  console.error(err);
  return res.status(err.statusCode).json({ message: err.message });
};

module.exports = errorHandler;
