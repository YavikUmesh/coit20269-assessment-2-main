"use strict";

function notFound(req, res) {
  res.status(404).json({
    error: { message: `Not found: ${req.method} ${req.originalUrl}`, status: 404 },
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({
    error: {
      message: status >= 500 ? "Internal server error" : err.message,
      status,
    },
  });
}

module.exports = { notFound, errorHandler };
