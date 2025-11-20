import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, MessageCircle, User, ArrowRight, Clock } from 'lucide-react';

const PostListItem = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-300 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Featured Image */}
          <div className="lg:w-48 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden flex-shrink-0">
            {post.featuredImage && post.featuredImage !== 'default-post.jpg' ? (
              <img 
                src={`http://localhost:5000/uploads/${post.featuredImage}`} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-2xl opacity-80">📝</div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Category */}
            <div className="mb-3">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {post.category?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {post.excerpt || post.content.substring(0, 150) + '...'}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span className="font-medium">{post.author?.firstName} {post.author?.lastName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime || 5} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentsCount || 0}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-gray-500 text-xs">+{post.tags.length - 3} more</span>
                )}
              </div>
            )}

            {/* Read More Button */}
            <Link
              to={`/posts/${post.slug || post._id}`}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group/button"
            >
              <span>Read Full Post</span>
              <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;