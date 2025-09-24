/**
 * Custom error handling middleware.
 * It catches errors and sends a structured JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // Use the status code from the error if it exists, otherwise default to 500
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Show stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Middleware to handle routes that are not found.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };