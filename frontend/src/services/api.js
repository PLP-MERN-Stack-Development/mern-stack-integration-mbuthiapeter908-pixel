// client/src/services/api.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // We'll add the token dynamically in each service call
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log('🔐 Authentication required - 401 Unauthorized');
      // You might want to redirect to login or show auth modal
    }
    
    if (error.response?.status === 403) {
      console.log('🚫 Insufficient permissions - 403 Forbidden');
    }
    
    return Promise.reject(error);
  }
);

// Post API services
export const postService = {
  // Get all posts with pagination and filters
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get a single post by ID or slug
  getPost: async (idOrSlug) => {
    const response = await api.get(`/posts/${idOrSlug}`);
    return response.data;
  },

  // Create a new post
  createPost: async (postData, getAuthToken) => {
    console.log('🔄 Creating post with data:', postData);
    
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please sign in to create a post.');
    }

    console.log('🔐 Using token for post creation');
    
    const response = await api.post('/posts', postData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Update an existing post
  updatePost: async (id, postData, getAuthToken) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please sign in to update a post.');
    }

    const response = await api.put(`/posts/${id}`, postData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Delete a post
  deletePost: async (id, getAuthToken) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please sign in to delete a post.');
    }

    const response = await api.delete(`/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId, commentData, getAuthToken) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please sign in to add a comment.');
    }

    const response = await api.post(`/posts/${postId}/comments`, commentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Toggle like on a post
  toggleLike: async (postId, getAuthToken) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please sign in to like a post.');
    }

    const response = await api.post(`/posts/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Search posts
  searchPosts: async (query, page = 1, limit = 10) => {
    const response = await api.get(`/posts/search?q=${query}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get popular posts
  getPopularPosts: async (limit = 10) => {
    const response = await api.get(`/posts/popular?limit=${limit}`);
    return response.data;
  },
};

// Category API services
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get single category
  getCategory: async (idOrSlug) => {
    const response = await api.get(`/categories/${idOrSlug}`);
    return response.data;
  },

  // Create a new category
  createCategory: async (categoryData, getAuthToken) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please sign in to create a category.');
    }

    const response = await api.post('/categories', categoryData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

// Auth API services
export const authService = {
  // Get current user profile
  getCurrentUser: async (getAuthToken) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required.');
    }

    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData, getAuthToken) => {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required.');
    }

    const response = await api.put('/auth/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;