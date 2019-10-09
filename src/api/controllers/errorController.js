import AppError from './../../utils/appError';

const handleCastError = err => {
  // const value = err.message.match(/(["'])(\\?.)*?\1/)
  //const message = `Invalid ${err.message.split("model")[1].replace(/\\" /g, "")}`

  return new AppError('Invalid Id', 400);
};
const handleJwtError = err => {
  const message = 'Invalid Token';
  return new AppError(message, 401);
};
const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `${errors.join('. ')}`;

  return new AppError(message, 400);
};
const handleDuplicateFields = err => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //const field = Object.keys(err.keyValue)[0];
  const message = `Email already exists`;
  return new AppError(message, 400);
};
const prodError = (err, res) => {
  if (err.operational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(500).json({
      status: err.status,
      message: 'An error Occured'
    });
  }
};

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'test'
  ) {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError(error);
    prodError(error, res);
  }
};
