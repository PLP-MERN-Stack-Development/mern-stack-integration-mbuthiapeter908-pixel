// client/src/pages/CreatePost.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { postService } from '../services/api';
import { useBlogAuth } from '../context/AuthContext';
import RichTextEditor from '../components/posts/RichTextEditor';
import ImageUpload from '../components/posts/ImageUpload';
import Button from '../components/ui/Button';
import { ArrowLeft, Save, Eye, Tag, Hash, BookOpen, AlertCircle, Plus } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { getAuthToken } = useBlogAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    featuredImage: 'default-post.jpg',
    isPublished: false
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Sample categories as fallback
  const sampleCategories = [
    { _id: 'tech', name: 'Technology', description: 'Tech and programming' },
    { _id: 'lifestyle', name: 'Lifestyle', description: 'Life and personal development' },
    { _id: 'travel', name: 'Travel', description: 'Adventure and exploration' },
    { _id: 'food', name: 'Food & Cooking', description: 'Recipes and culinary adventures' },
    { _id: 'health', name: 'Health & Wellness', description: 'Fitness and well-being' },
    { _id: 'business', name: 'Business', description: 'Entrepreneurship and career' }
  ];

  // Use actual categories if available, otherwise use samples
  const availableCategories = categories && categories.length > 0 ? categories : sampleCategories;
  const usingSampleCategories = categories.length === 0;

  useEffect(() => {
    // Auto-select the first category if none is selected and categories are available
    if (!formData.category && availableCategories.length > 0) {
      setFormData(prev => ({
        ...prev,
        category: availableCategories[0]._id
      }));
    }
  }, [availableCategories, formData.category]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (formData.excerpt.length > 200) {
      newErrors.excerpt = 'Excerpt must be less than 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish = false) => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const postData = {
        ...formData,
        isPublished: publish
      };

      // If using sample categories, we need to handle them differently
      // For now, we'll use the sample category ID directly
      // In a real app, you might want to create the category first
      
      console.log('Submitting post with category:', postData.category);
      
      await postService.createPost(postData, getAuthToken);
      
      // Show success message
      alert(publish ? 'Post published successfully!' : 'Post saved as draft!');
      navigate('/posts');
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            onClick={() => navigate('/posts')}
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Posts
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Post
          </h1>
          <p className="text-gray-600 mt-2">
            Share your knowledge and insights with the community
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Post Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter a captivating title for your post..."
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 text-gray-900 placeholder-gray-500 font-semibold text-lg ${
                errors.title 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2 font-medium">{errors.title}</p>
            )}
            <div className="text-sm text-gray-500 mt-2 font-medium">
              {formData.title.length}/100 characters
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Excerpt (Optional)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Brief summary of your post... (max 200 characters)"
              rows="3"
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium resize-none ${
                errors.excerpt 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.excerpt && (
              <p className="text-red-500 text-sm mt-2 font-medium">{errors.excerpt}</p>
            )}
            <div className="text-sm text-gray-500 mt-2 font-medium">
              {formData.excerpt.length}/200 characters
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-2 font-medium">{errors.content}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Featured Image
            </h3>
            <ImageUpload
              onImageUpload={(image) => handleInputChange('featuredImage', image || 'default-post.jpg')}
              currentImage={formData.featuredImage}
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category *
              </h3>
              {usingSampleCategories && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Sample
                </span>
              )}
            </div>

            {categoriesError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Could not load categories</span>
                </div>
              </div>
            )}

            {usingSampleCategories && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Using sample categories</span>
                </div>
              </div>
            )}

            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 text-gray-900 font-medium ${
                errors.category 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
              disabled={categoriesLoading && availableCategories.length === 0}
            >
              <option value="">Select a category</option>
              {availableCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                  {category.description && ` - ${category.description}`}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-2 font-medium">{errors.category}</p>
            )}
            
            {categoriesLoading && (
              <div className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading categories...</span>
              </div>
            )}
            
            <div className="mt-3 text-xs text-gray-500">
              {availableCategories.length} categories available
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Tags
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-900 placeholder-gray-500"
                />
                <Button
                  onClick={addTag}
                  variant="primary"
                  size="sm"
                  disabled={!currentTag.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Tags List */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-200 transition-colors text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              {formData.tags.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  Add tags to help readers find your post
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Post Actions
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => handleSubmit(false)}
                variant="outline"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>
              
              <Button
                onClick={() => handleSubmit(true)}
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Eye className="w-4 h-4" />
                Publish Post
              </Button>
            </div>
            
            {/* Form Status */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Form Status</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Title:</span>
                  <span className={formData.title ? 'text-green-600 font-semibold' : 'text-red-600'}>
                    {formData.title ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Content:</span>
                  <span className={formData.content.length >= 50 ? 'text-green-600 font-semibold' : 'text-red-600'}>
                    {formData.content.length >= 50 ? '✓' : `${formData.content.length}/50`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className={formData.category ? 'text-green-600 font-semibold' : 'text-red-600'}>
                    {formData.category ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;