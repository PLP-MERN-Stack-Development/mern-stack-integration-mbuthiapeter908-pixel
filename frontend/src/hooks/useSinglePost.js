// client/src/hooks/useSinglePost.js
import { useState, useEffect } from 'react';
import { postService } from '../services/api';
import { useBlogAuth } from '../context/AuthContext';

export const useSinglePost = (idOrSlug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthToken } = useBlogAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postService.getPost(idOrSlug);
        setPost(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (idOrSlug) {
      fetchPost();
    }
  }, [idOrSlug]);

  const addComment = async (commentContent) => {
    try {
      const data = await postService.addComment(post._id, { content: commentContent }, getAuthToken);
      setPost(prevPost => ({
        ...prevPost,
        ...data.data.post
      }));
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const toggleLike = async () => {
    try {
      const data = await postService.toggleLike(post._id, getAuthToken);
      setPost(prevPost => ({
        ...prevPost,
        ...data.data
      }));
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to toggle like');
    }
  };

  return { 
    post, 
    loading, 
    error, 
    addComment,
    toggleLike,
    setPost 
  };
};