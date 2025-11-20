// src/models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
      match: [/^[a-zA-Z0-9\s-]+$/, 'Category name can only contain letters, numbers, spaces, and hyphens']
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
      default: ''
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    postCount: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Generate slug before saving
CategorySchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    return next();
  }
  
  const slugify = require('slugify');
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  
  next();
});

// Virtual for category's posts
CategorySchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'category'
});

// Update post count when posts are added/removed
CategorySchema.statics.updatePostCount = async function (categoryId) {
  const Post = mongoose.model('Post');
  const postCount = await Post.countDocuments({ 
    category: categoryId, 
    isPublished: true 
  });
  
  await this.findByIdAndUpdate(categoryId, { postCount });
};

// Index for better query performance
CategorySchema.index({ slug: 1 });
CategorySchema.index({ name: 1 });
CategorySchema.index({ isActive: 1 });

module.exports = mongoose.model('Category', CategorySchema);