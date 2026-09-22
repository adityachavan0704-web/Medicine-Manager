/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let status = 500;
  let message = 'Internal server error';

  // Specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.message === 'Invalid credentials' || err.message === 'Invalid or expired token') {
    status = 401;
    message = err.message;
  } else if (err.message === 'Insufficient permissions') {
    status = 403;
    message = err.message;
  } else if (err.message?.includes('not found')) {
    status = 404;
    message = err.message;
  } else if (err.message) {
    message = err.message;
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

module.exports = {
  errorHandler,
  notFound
};
