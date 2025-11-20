// client/src/hooks/useCategories.js
import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Fetching categories from API...');
        
        const data = await categoryService.getAllCategories();
        console.log('📦 Categories API raw response:', data);
        
        // Check different possible response structures
        let categoriesData = [];
        
        if (Array.isArray(data)) {
          categoriesData = data;
        } else if (data && Array.isArray(data.data)) {
          categoriesData = data.data;
        } else if (data && Array.isArray(data.categories)) {
          categoriesData = data.categories;
        } else if (data && data.success && Array.isArray(data.data)) {
          categoriesData = data.data;
        } else {
          console.warn('❌ Unexpected categories response structure:', data);
        }
        
        console.log('✅ Processed categories:', categoriesData);
        console.log('📊 Categories count:', categoriesData.length);
        
        if (categoriesData.length > 0) {
          console.log('📝 First category sample:', categoriesData[0]);
        }
        
        setCategories(categoriesData);
      } catch (err) {
        console.error('❌ Error fetching categories:', err);
        console.error('Error details:', err.response?.data);
        setError(err.response?.data?.message || err.message || 'Failed to fetch categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};