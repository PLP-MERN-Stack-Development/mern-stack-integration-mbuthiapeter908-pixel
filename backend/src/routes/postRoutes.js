// backend/src/routes/postRoutes.js
const express = require('express');
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
  addComment,
  toggleLike,
  getPopularPosts
} = require('../controllers/postController');
const {
  createPostValidation,
  updatePostValidation,
  commentValidation
} = require('../validation/postValidation');
const {
  requireAuth,
  requireOwnership,
  handleValidationErrors,
  createPostLimiter
} = require('../middleware');
const { Post } = require('../models');

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/search', searchPosts);
router.get('/popular', getPopularPosts);
router.get('/:id', getPost);

// Protected routes
router.post(
  '/',
  requireAuth,
  createPostLimiter,
  createPostValidation,
  handleValidationErrors,
  createPost
);

router.put(
  '/:id',
  requireAuth,
  requireOwnership(Post),
  updatePostValidation,
  handleValidationErrors,
  updatePost
);

router.delete(
  '/:id',
  requireAuth,
  requireOwnership(Post),
  deletePost
);

// Comments and likes
router.post(
  '/:id/comments',
  requireAuth,
  commentValidation,
  handleValidationErrors,
  addComment
);

router.post(
  '/:id/like',
  requireAuth,
  toggleLike
);

module.exports = router;