// src/middleware/auth.js - TEMPORARY VERSION
const { User } = require('../models');

/**
 * Temporary auth middleware for development
 * In production, replace with proper Clerk verification
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = req.headers.authorization.split(' ')[1];
    
    // For development only - accept any token
    console.log('🔐 Development mode: Bypassing token verification');
    
    // Get the first user from database for development
    const user = await User.findOne().sort({ createdAt: 1 });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No users found in database. Please run npm run seed first.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('🔐 Auth middleware error:'.red, error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication server error.'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const user = await User.findOne().sort({ createdAt: 1 });
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

const requireOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Authentication required.'
        });
      }

      const resourceId = req.params[paramName];
      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found.'
        });
      }

      const isOwner = resource.author && resource.author.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only modify your own resources.'
        });
      }

      req.resource = resource;
      next();

    } catch (error) {
      console.error('Ownership middleware error:'.red, error);
      return res.status(500).json({
        success: false,
        message: 'Server error while checking ownership.'
      });
    }
  };
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
  requireOwnership
};