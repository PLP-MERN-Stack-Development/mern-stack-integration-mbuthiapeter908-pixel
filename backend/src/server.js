// src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import middleware
const {
  errorHandler,
  generalLimiter,
  securityHeaders,
  corsOptions,
  requireAuth
} = require('./middleware');

// Import routes
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(securityHeaders);

// CORS middleware - MUST be before other middleware
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Log requests in development mode
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 MERN Blog API is running successfully!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    cors: {
      enabled: true,
      mode: process.env.NODE_ENV === 'production' ? 'strict' : 'development'
    }
  });
});

// Auth test route (protected)
app.get('/api/auth/test', requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: '🔐 Authentication successful!',
    user: req.user.getPublicProfile ? req.user.getPublicProfile() : req.user
  });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS is working correctly!',
    request: {
      origin: req.headers.origin || 'No origin header',
      method: req.method,
      headers: req.headers
    },
    cors: {
      mode: process.env.NODE_ENV,
      allowed: true
    }
  });
});

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MERN Blog API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth_test: '/api/auth/test',
      posts: '/api/posts',
      categories: '/api/categories',
      documentation: 'Coming soon...'
    },
    cors: {
      enabled: true,
      allowed_origins: process.env.NODE_ENV === 'production' ? 
        ['http://localhost:3000', 'http://localhost:5173'] : 
        'All origins (development mode)'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    available_endpoints: {
      posts: '/api/posts',
      categories: '/api/categories',
      auth: '/api/auth'
    }
  });
});

// Global error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\nServer running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log(`Frontend: http://localhost:5173`);
  console.log(`Clerk Secret Key: ${process.env.CLERK_SECRET_KEY ? 'Set' : 'Missing'}`);
  console.log(`MongoDB: ${process.env.MONGODB_URI}`);
  console.log(`CORS: ${process.env.NODE_ENV === 'production' ? 'Strict mode' : 'Development mode'}`);
});

module.exports = app;