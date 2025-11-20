// backend/src/middleware/index.js
const { requireAuth, optionalAuth, requireRole, requireOwnership } = require('./auth');
const errorHandler = require('./errorHandler');
const { handleValidationErrors } = require('./validation');
const { generalLimiter, authLimiter, createPostLimiter } = require('./rateLimiter');
const { securityHeaders, corsOptions } = require('./security');

module.exports = {
  // Authentication
  requireAuth,
  optionalAuth,
  requireRole,
  requireOwnership,
  
  // Error Handling
  errorHandler,
  
  // Validation
  handleValidationErrors,
  
  // Rate Limiting
  generalLimiter,
  authLimiter,
  createPostLimiter,
  
  // Security
  securityHeaders,
  corsOptions
};