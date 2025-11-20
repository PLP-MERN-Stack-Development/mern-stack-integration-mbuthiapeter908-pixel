import React from 'react';
import PostCard from './PostCard';
import PostListItem from './PostListItem'; // We'll create this
import { Loader } from 'lucide-react';

const PostGrid = ({ posts, loading, error, viewMode = 'grid' }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-semibold">
            Loading amazing content...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return null; // Let the parent component handle empty state
  }

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
        {posts.map((post, index) => (
          <div 
            key={post._id} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6 animate-fade-in">
      {posts.map((post, index) => (
        <div 
          key={post._id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <PostListItem post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostGrid;