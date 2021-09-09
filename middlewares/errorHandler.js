function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Произошла ошибка на сервере.' : err.message;
  res.status(status).send({ message });
  return next();
}

module.exports = { errorHandler };
