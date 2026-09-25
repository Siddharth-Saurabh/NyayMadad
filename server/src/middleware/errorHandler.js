import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || null;

  // Handle Mongoose / MongoDB errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    code = 'DATABASE_VALIDATION_ERROR';
    message = Object.values(err.errors).map(e => e.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_KEY_ERROR';
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}`;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Invalid ${err.path}: ${err.value}`;
  }

  logger.error(`[API Error] ${req.method} ${req.originalUrl} - ${statusCode} - ${message}`, err);

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(details && { details }),
    ...(config.env === 'development' && { stack: err.stack })
  });
};
