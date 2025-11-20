// backend/src/controllers/postController.js
const { Post, Category } = require('../models');

/**
 * @desc    Get all posts with pagination and filtering
 * @route   GET /api/posts
 * @access  Public
 */
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isPublished: true };
    if (category) {
      query.category = category;
    }

    // Get posts with population
    const posts = await Post.find(query)
      .populate('author', 'username firstName lastName profileImage')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Format response
    const formattedPosts = posts.map(post => ({
      ...post,
      likesCount: post.likes.length,
      commentsCount: post.comments.filter(c => c.isActive).length
    }));

    res.status(200).json({
      success: true,
      count: formattedPosts.length,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      data: formattedPosts
    });

  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts'
    });
  }
};

/**
 * @desc    Get single post by ID or slug
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ID is a valid ObjectId or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const post = await Post.findOne(query)
      .populate('author', 'username firstName lastName profileImage')
      .populate('category', 'name slug')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count (non-blocking)
    Post.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } }).exec();

    // Format response
    const formattedPost = {
      ...post,
      likesCount: post.likes.length,
      comments: post.comments.filter(c => c.isActive),
      commentsCount: post.comments.filter(c => c.isActive).length
    };

    res.status(200).json({
      success: true,
      data: formattedPost
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post'
    });
  }
};

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, isPublished, featuredImage } = req.body;

    console.log('Creating post with category:', category);

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post title is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    // Sample categories that we'll allow
    const sampleCategories = {
      'tech': 'Technology',
      'lifestyle': 'Lifestyle', 
      'travel': 'Travel',
      'food': 'Food & Cooking',
      'health': 'Health & Wellness',
      'business': 'Business'
    };

    let categoryIsValid = false;

    // Check if it's a sample category
    if (sampleCategories[category]) {
      categoryIsValid = true;
      console.log('Using sample category:', sampleCategories[category]);
    } else {
      // Check if category exists in database
      const categoryExists = await Category.findById(category);
      categoryIsValid = !!categoryExists;
    }

    if (!categoryIsValid) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Generate slug from title
    const slugify = (text) => {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    };

    let slug = slugify(title);
    let slugCounter = 1;
    let originalSlug = slug;

    // Check for existing slugs and make unique
    while (await Post.findOne({ slug })) {
      slug = `${originalSlug}-${slugCounter}`;
      slugCounter++;
    }

    // Create post
    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt ? excerpt.trim() : '',
      category: category,
      tags: tags ? tags.map(tag => tag.trim().toLowerCase()) : [],
      isPublished: isPublished || false,
      featuredImage: featuredImage || 'default-post.jpg',
      author: req.user._id,
      slug: slug
    });

    // For sample categories, we need to handle the response differently
    let responsePost;
    
    if (sampleCategories[category]) {
      // Manually create response for sample categories
      responsePost = {
        ...post.toObject(),
        category: {
          _id: category,
          name: sampleCategories[category],
          slug: category,
          isSample: true
        }
      };
    } else {
      // Normal population for database categories
      responsePost = await Post.findById(post._id)
        .populate('author', 'username firstName lastName profileImage')
        .populate('category', 'name slug');
    }

    res.status(201).json({
      success: true,
      message: isPublished ? 'Post published successfully!' : 'Post saved as draft',
      data: responsePost
    });

  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A post with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating post'
    });
  }
};

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated
    delete updateData.author;
    delete updateData._id;

    const post = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('author', 'username firstName lastName profileImage')
    .populate('category', 'name slug');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });

  } catch (error) {
    console.error('Update post error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A post with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating post'
    });
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post'
    });
  }
};

/**
 * @desc    Search posts
 * @route   GET /api/posts/search
 * @access  Public
 */
const searchPosts = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skip = (page - 1) * limit;

    const searchResults = await Post.find({
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .populate('author', 'username firstName lastName profileImage')
    .populate('category', 'name slug')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

    res.status(200).json({
      success: true,
      query: query.trim(),
      count: searchResults.length,
      data: searchResults
    });

  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching posts'
    });
  }
};

/**
 * @desc    Add comment to post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Add comment
    await post.addComment(req.user._id, content);

    // Get updated post with populated comments
    const updatedPost = await Post.findById(id)
      .populate('author', 'username firstName lastName profileImage')
      .populate('category', 'name slug')
      .populate('comments.user', 'username firstName lastName profileImage');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        post: updatedPost,
        comment: updatedPost.comments[updatedPost.comments.length - 1]
      }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
};

/**
 * @desc    Toggle like on post
 * @route   POST /api/posts/:id/like
 * @access  Private
 */
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.toggleLike(req.user._id);

    const updatedPost = await Post.findById(id)
      .populate('author', 'username firstName lastName profileImage')
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Like updated successfully',
      data: updatedPost
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating like'
    });
  }
};

/**
 * @desc    Get popular posts
 * @route   GET /api/posts/popular
 * @access  Public
 */
const getPopularPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const popularPosts = await Post.find({ isPublished: true })
      .sort({ viewCount: -1, 'likes.length': -1 })
      .limit(limit)
      .populate('author', 'username firstName lastName profileImage')
      .populate('category', 'name slug')
      .lean();

    res.status(200).json({
      success: true,
      count: popularPosts.length,
      data: popularPosts
    });

  } catch (error) {
    console.error('Get popular posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular posts'
    });
  }
};

// Export all functions
module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
  addComment,
  toggleLike,
  getPopularPosts
};