// client/src/pages/SinglePost.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSinglePost } from '../hooks/useSinglePost';
import CommentsList from '../components/posts/commentsList';
import CommentForm from '../components/posts/CommentForm';
import { Calendar, Eye, MessageCircle, User, Tag, ArrowLeft, Share2, Bookmark, Heart, Clock } from 'lucide-react';
import Button from '../components/ui/Button';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading, error, addComment, toggleLike } = useSinglePost(id);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleAddComment = async (commentContent) => {
    setCommentLoading(true);
    try {
      await addComment(commentContent);
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.message || 'Failed to add comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleToggleLike = async () => {
    setLikeLoading(true);
    try {
      await toggleLike();
    } catch (err) {
      console.error('Error toggling like:', err);
      alert(err.message || 'Failed to update like. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const readingTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Back Button Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-gray-300 rounded-xl w-32"></div>
          </div>

          {/* Post Header Skeleton */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8 animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded mb-6 w-1/2"></div>
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Post Not Found
            </h2>
            <p className="text-red-600 mb-6 text-lg">
              {error}
            </p>
            <Button 
              onClick={() => navigate('/posts')}
              variant="primary"
              size="lg"
            >
              Back to All Posts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/posts')}
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Posts
          </Button>
        </div>

        {/* Featured Image */}
        {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={`http://localhost:5000/uploads/${post.featuredImage}`} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8 shadow-lg">
          {/* Category */}
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {post.category?.name || 'Uncategorized'}
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleToggleLike}
                disabled={likeLoading}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <Heart className={`w-5 h-5 ${post.likesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-green-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="font-semibold text-gray-700">
                {post.author?.firstName} {post.author?.lastName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime || readingTime(post.content)} min read</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount || 0} views</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentsCount || 0} comments</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>{post.likesCount || 0} likes</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8 shadow-lg">
          <article className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {post.content}
            </div>
          </article>
        </div>

        {/* Comments Section */}
        <div className="space-y-8">
          <CommentForm 
            onSubmit={handleAddComment} 
            loading={commentLoading}
          />
          <CommentsList 
            comments={post.comments || []} 
            loading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;