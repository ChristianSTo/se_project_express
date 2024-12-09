const errorHandler = (err, req, res, next) => {
  // this is the error handler
  console.error(err);

  const statusCode = err.statusCode || 500;

  const message =
    statusCode === 500 ? "An error has occured on the server" : err.message;

  res.status(err.statusCode).json({ message });
  next();
};

module.exports = errorHandler;
