// src/components/ui/LoadingSkeleton.jsx
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-dark-800 rounded-2xl border-2 border-gray-200 dark:border-dark-600 overflow-hidden">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-300 dark:bg-dark-700"></div>
            
            {/* Content Skeleton */}
            <div className="p-6">
              <div className="h-6 bg-gray-300 dark:bg-dark-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded mb-4 w-3/4"></div>
              
              {/* Meta Skeleton */}
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 dark:bg-dark-700 rounded w-1/4"></div>
              </div>
              
              {/* Button Skeleton */}
              <div className="h-12 bg-gray-300 dark:bg-dark-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;