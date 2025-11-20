import React, { useState, useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
import { postService } from '../services/api';
import PostGrid from '../components/posts/PostGrid';
import CategoryFilter from '../components/posts/CategoryFilter';
import SearchBar from '../components/posts/SearchBar';
import { Filter, Grid, List } from 'lucide-react';

const Posts = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPosts, setSearchedPosts] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const { posts, loading, error, pagination } = usePosts(page, 9, selectedCategory);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  // Debug: Log the current state
  console.log('Posts page state:', {
    selectedCategory,
    categoriesCount: categories?.length,
    categories,
    postsCount: posts?.length,
    loading,
    categoriesLoading
  });

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    console.log('Category changed to:', categoryId);
    setSelectedCategory(categoryId);
    setPage(1); // Reset to first page when category changes
    setSearchQuery(''); // Clear search when category changes
    setSearchedPosts(null); // Clear search results
  };

  // Handle search
  const handleSearch = async (query) => {
    console.log('Search query:', query);
    setSearchQuery(query);
    setSearchedPosts(null);
    setPage(1);
    
    if (query.trim()) {
      try {
        const data = await postService.searchPosts(query.trim());
        console.log('Search results:', data);
        setSearchedPosts(data.data || []);
      } catch (err) {
        console.error('Search error:', err);
        setSearchedPosts([]);
      }
    } else {
      // If search query is empty, clear search results
      setSearchedPosts(null);
    }
  };

  // Reset when category changes
  useEffect(() => {
    setSearchQuery('');
    setSearchedPosts(null);
    setPage(1);
  }, [selectedCategory]);

  const displayPosts = searchedPosts !== null ? searchedPosts : posts;
  const hasMore = pagination?.hasNext || false;

  // Get current category name for display
  const getCurrentCategoryName = () => {
    if (!selectedCategory) return null;
    const category = categories.find(cat => (cat._id || cat.id) === selectedCategory);
    return category?.name || 'Selected category';
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Explore Blog Posts
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing stories, tutorials, and insights from our community of passionate writers.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} placeholder="Search posts by title, content, or tags..." />

      {/* Category Error Message */}
      {categoriesError && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
          <div className="flex items-center">
            <div className="text-red-500 mr-3">⚠️</div>
            <div>
              <p className="text-red-800 font-semibold">
                Error loading categories
              </p>
              <p className="text-red-600 text-sm mt-1">
                {categoriesError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        {/* Category Filter */}
        <div className="flex-1">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            loading={categoriesLoading}
          />
        </div>

        {/* View Mode and Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Stats */}
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border-2 border-gray-200">
            <span className="font-semibold">
              {pagination?.total || 0} posts
              {selectedCategory && ` in ${getCurrentCategoryName()}`}
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-2xl p-2 border-2 border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
              }`}
              title="Grid View"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Category Info */}
      {selectedCategory && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-blue-800 font-semibold">
                Showing posts from: <span className="text-purple-600">{getCurrentCategoryName()}</span>
              </p>
            </div>
            <button
              onClick={() => handleCategoryChange(null)}
              className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Show all categories
            </button>
          </div>
        </div>
      )}

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-green-800 font-semibold">
                {searchedPosts?.length || 0} results found for "{searchQuery}"
              </p>
            </div>
            <button
              onClick={() => handleSearch('')}
              className="text-green-600 hover:text-green-800 font-medium px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Loading State for Categories */}
      {categoriesLoading && !categoriesError && (
        <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading categories...</p>
          </div>
        </div>
      )}

      {/* Posts Grid/List */}
      <PostGrid 
        posts={displayPosts} 
        loading={loading && !searchedPosts} 
        error={error} 
        viewMode={viewMode}
      />

      {/* Load More Button */}
      {hasMore && !searchedPosts && !loading && displayPosts.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-2xl hover:shadow-3xl"
          >
            Load More Posts ({pagination.total - displayPosts.length} remaining)
          </button>
        </div>
      )}

      {/* End of Results Message */}
      {!hasMore && displayPosts.length > 0 && !searchedPosts && (
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl p-6 max-w-md mx-auto">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-gray-600 font-medium">
              You've reached the end! {pagination.total} posts loaded.
            </p>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {!loading && !categoriesLoading && displayPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-12 max-w-2xl mx-auto">
            <div className="text-6xl mb-6">
              {searchQuery ? '🔍' : selectedCategory ? '📂' : '📝'}
            </div>
            
            {searchQuery ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No matching posts found
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  We couldn't find any posts matching "<span className="font-semibold">{searchQuery}</span>".
                  Try different keywords or browse all categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => handleSearch('')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Browse All Posts
                  </button>
                </div>
              </>
            ) : selectedCategory ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No posts in this category yet
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  The "<span className="font-semibold">{getCurrentCategoryName()}</span>" category doesn't have any published posts yet.
                  Be the first to write about this topic!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Browse All Categories
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Posts Yet
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  The blog is waiting for its first story! Be the pioneer and share your knowledge with the community.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Loading State for Posts */}
      {loading && displayPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-semibold text-lg">
              {selectedCategory 
                ? `Loading posts from ${getCurrentCategoryName()}...` 
                : 'Loading amazing content...'
              }
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Unable to Load Posts
            </h3>
            <p className="text-red-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;