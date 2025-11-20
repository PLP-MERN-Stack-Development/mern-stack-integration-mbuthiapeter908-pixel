// src/routes/categoryRoutes.js
const express = require('express');
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const {
  createCategoryValidation
} = require('../validation/categoryValidation');
const {
  requireAuth,
  requireRole,
  handleValidationErrors
} = require('../middleware');

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Protected routes (Admin/Moderator only)
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'moderator']),
  createCategoryValidation,
  handleValidationErrors,
  createCategory
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'moderator']),
  createCategoryValidation,
  handleValidationErrors,
  updateCategory
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  deleteCategory
);

module.exports = router;