const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  if (process.env.NODE_ENV === 'development') {
    // Development: Send detailed error
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: Send limited error info
    if (err.isOperational) {
      // Operational, trusted error: send message to client
      res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or unknown error: don't leak error details
      logger.error('ERROR 💥', err);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
};

module.exports = errorHandler;
module.exports.AppError = AppError;
