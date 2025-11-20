// src/components/posts/Comment.jsx
import React from 'react';
import { User, Clock, Heart, MessageCircle } from 'lucide-react';

const Comment = ({ comment }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl border-2 border-gray-200 dark:border-dark-600 p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group">
      {/* Comment Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          
          {/* User Info */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">
              {comment.user?.username || 'Anonymous'}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">12</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Reply</span>
          </button>
        </div>
      </div>

      {/* Comment Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          {comment.content}
        </p>
      </div>

      {/* Reply Thread (Nested Comments) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-6 ml-8 space-y-4 border-l-2 border-blue-200 dark:border-blue-800 pl-6">
          {comment.replies.map((reply) => (
            <Comment key={reply._id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;