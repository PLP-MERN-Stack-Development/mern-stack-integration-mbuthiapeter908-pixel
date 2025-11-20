// src/components/posts/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, MessageCircle, User, ArrowRight } from 'lucide-react';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl border-2 border-gray-200 dark:border-dark-600 overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl group">
      {/* Featured Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {post.featuredImage && post.featuredImage !== 'default-post.jpg' ? (
          <img 
            src={`/uploads/${post.featuredImage}`} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-4xl font-bold opacity-80">📝</div>
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 dark:bg-dark-800/90 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
            {post.category?.name || 'Uncategorized'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className="font-medium">{post.author?.username || 'Anonymous'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{post.viewCount || 0} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments?.length || 0} comments</span>
          </div>
        </div>

        {/* Read More Button */}
        <Link
          to={`/posts/${post.slug || post._id}`}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span>Read More</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default PostCard;