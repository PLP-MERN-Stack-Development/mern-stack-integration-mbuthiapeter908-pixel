// src/controllers/categoryController.js
const { Category, Post } = require('../models');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('createdBy', 'username firstName lastName')
      .sort({ name: 1 })
      .lean();

    // Get post counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const postCount = await Post.countDocuments({ 
          category: category._id, 
          isPublished: true 
        });
        return {
          ...category,
          postCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCounts.length,
      data: categoriesWithCounts
    });

  } catch (error) {
    console.error('Get categories error:'.red, error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};

/**
 * @desc    Get single category by ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ID is a valid ObjectId or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const category = await Category.findOne(query)
      .populate('createdBy', 'username firstName lastName profileImage')
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get posts for this category
    const posts = await Post.find({ 
      category: category._id, 
      isPublished: true 
    })
    .populate('author', 'username firstName lastName profileImage')
    .populate('category', 'name slug')
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();

    const categoryWithPosts = {
      ...category,
      posts: posts.map(post => ({
        ...post,
        likesCount: post.likes.length,
        commentsCount: post.comments.filter(c => c.isActive).length
      }))
    };

    res.status(200).json({
      success: true,
      data: categoryWithPosts
    });

  } catch (error) {
    console.error('Get category error:'.red, error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category'
    });
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private (Admin/Moderator)
 */
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name,
      description,
      createdBy: req.user._id
    });

    const populatedCategory = await Category.findById(category._id)
      .populate('createdBy', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: populatedCategory
    });

  } catch (error) {
    console.error('Create category error:'.red, error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating category'
    });
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin/Moderator)
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, isActive },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username firstName lastName');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });

  } catch (error) {
    console.error('Update category error:'.red, error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating category'
    });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has posts
    const postCount = await Post.countDocuments({ category: id });
    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category that has posts. Please reassign or delete posts first.'
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:'.red, error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category'
    });
  }
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};