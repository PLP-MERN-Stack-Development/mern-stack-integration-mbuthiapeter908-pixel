// client/src/components/posts/CategoryFilter.jsx
import React from 'react';
import { Tag } from 'lucide-react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, loading }) => {
  // Debug: Log categories to see what we're receiving
  console.log('Categories received:', categories);
  console.log('Selected category:', selectedCategory);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-full px-4 py-2 animate-pulse"
          >
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Check if categories is empty or malformed
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onCategoryChange(null)}
        className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
          !selectedCategory
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Tag className="w-4 h-4" />
        <span>All Posts</span>
      </button>

      {categories.map((category) => {
        // Debug each category
        console.log('Rendering category:', category);
        
        return (
          <button
            key={category._id || category.id}
            onClick={() => onCategoryChange(category._id || category.id)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === (category._id || category.id)
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name} {category.postCount ? `(${category.postCount})` : ''}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;