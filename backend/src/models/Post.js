// src/models/Post.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Post content is required']
    },
    featuredImage: {
      type: String,
      default: 'default-post.jpg'
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [20, 'Tag cannot be more than 20 characters']
    }],
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date,
      default: null
    },
    viewCount: {
      type: Number,
      default: 0
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [CommentSchema],
    readingTime: {
      type: Number,
      default: 0
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot be more than 160 characters']
    },
    seoKeywords: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Generate slug before saving
PostSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  const slugify = require('slugify');
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  
  next();
});

// Set publishedAt when post is published
PostSchema.pre('save', function (next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Calculate reading time before saving
PostSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Update category post count after post is saved
PostSchema.post('save', async function () {
  const Category = mongoose.model('Category');
  await Category.updatePostCount(this.category);
});

// Update category post count after post is removed
PostSchema.post('remove', async function () {
  const Category = mongoose.model('Category');
  await Category.updatePostCount(this.category);
});

// Virtual for post URL
PostSchema.virtual('url').get(function () {
  return `/posts/${this.slug}`;
});

// Virtual for likes count
PostSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

// Virtual for comments count
PostSchema.virtual('commentsCount').get(function () {
  return this.comments.length;
});

// Virtual for active comments only
PostSchema.virtual('activeComments').get(function () {
  return this.comments.filter(comment => comment.isActive);
});

// Instance method to add a comment
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

// Instance method to increment view count
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Instance method to toggle like
PostSchema.methods.toggleLike = function (userId) {
  const likeIndex = this.likes.indexOf(userId);
  
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  } else {
    this.likes.push(userId);
  }
  
  return this.save();
};

// Static method to get popular posts
PostSchema.statics.getPopularPosts = function (limit = 10) {
  return this.find({ isPublished: true })
    .sort({ viewCount: -1, 'likes.length': -1 })
    .limit(limit)
    .populate('author', 'username firstName lastName profileImage')
    .populate('category', 'name slug');
};

// Static method to search posts
PostSchema.statics.searchPosts = function (query, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { excerpt: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
  .sort({ publishedAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate('author', 'username firstName lastName profileImage')
  .populate('category', 'name slug');
};

// Indexes for better query performance
PostSchema.index({ slug: 1 });
PostSchema.index({ author: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ isPublished: 1 });
PostSchema.index({ publishedAt: -1 });
PostSchema.index({ 'tags': 1 });
PostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

module.exports = mongoose.model('Post', PostSchema);