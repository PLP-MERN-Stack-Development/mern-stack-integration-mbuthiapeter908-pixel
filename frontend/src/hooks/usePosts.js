// client/src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import { postService } from '../services/api';

export const usePosts = (page = 1, limit = 9, category = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postService.getAllPosts(page, limit, category);
        setPosts(data.data || []);
        setPagination(data.pagination || {});
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit, category]);

  return { 
    posts, 
    loading, 
    error, 
    pagination,
    setPosts 
  };
};