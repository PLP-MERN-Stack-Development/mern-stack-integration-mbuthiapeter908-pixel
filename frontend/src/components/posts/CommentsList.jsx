// src/components/posts/CommentsList.jsx
import React from 'react';
import Comment from './Comment';
import { MessageCircle, Users } from 'lucide-react';

const CommentsList = ({ comments, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white dark:bg-dark-800 rounded-2xl border-2 border-gray-200 dark:border-dark-600 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-dark-700 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 dark:bg-dark-700 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 max-w-md mx-auto">
          <div className="text-4xl mb-4">💭</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Comments Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Be the first to share your thoughts on this post!
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Start the conversation</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" />
          Community Discussion
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;