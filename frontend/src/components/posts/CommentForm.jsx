// src/components/posts/CommentForm.jsx
import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Send, MessageCircle } from 'lucide-react';
import Button from '../ui/Button';

const CommentForm = ({ onSubmit, loading = false }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment('');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-dark-800 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-500" />
        Share Your Thoughts
      </h3>

      <SignedOut>
        <div className="text-center py-6">
          <div className="text-4xl mb-4">💬</div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Join the Conversation
          </h4>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Sign in to post comments and engage with the community
          </p>
          <SignInButton mode="modal">
            <Button variant="primary" size="lg">
              Sign In to Comment
            </Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What are your thoughts on this post? Share your insights, questions, or feedback..."
              rows="4"
              className="w-full px-4 py-3 bg-white dark:bg-dark-700 border-2 border-gray-300 dark:border-dark-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900/30 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium resize-none shadow-inner"
              disabled={loading}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {comment.length}/500 characters
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!comment.trim() || loading}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Send className="w-4 h-4" />
              Post Comment
            </Button>
          </div>
        </form>
      </SignedIn>
    </div>
  );
};

export default CommentForm;