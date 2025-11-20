// src/hooks/usePostManagement.js
import { useState } from 'react';
import { postService } from '../services/api';
import { useBlogAuth } from '../context/AuthContext';

export const usePostManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAuthToken } = useBlogAuth();

  const createPost = async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await postService.createPost(postData, getAuthToken);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, postData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await postService.updatePost(postId, postData, getAuthToken);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await postService.deletePost(postId, getAuthToken);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createPost,
    updatePost,
    deletePost,
    loading,
    error,
    clearError: () => setError(null)
  };
};