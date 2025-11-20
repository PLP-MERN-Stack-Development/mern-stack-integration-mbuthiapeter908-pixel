// client/src/context/AuthContext.jsx
import { createContext, useContext } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

const BlogAuthContext = createContext();

export const useBlogAuth = () => {
  const context = useContext(BlogAuthContext);
  if (!context) {
    throw new Error('useBlogAuth must be used within an BlogAuthProvider');
  }
  return context;
};

export const BlogAuthProvider = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Function to get token for API calls
  const getAuthToken = async () => {
    try {
      if (!isSignedIn) {
        console.log('User not signed in, cannot get token');
        return null;
      }
      
      const token = await getToken();
      console.log('🔐 Token retrieved successfully');
      return token;
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      return null;
    }
  };

  const value = {
    isSignedIn,
    user,
    isLoaded,
    getAuthToken
  };

  return (
    <BlogAuthContext.Provider value={value}>
      {children}
    </BlogAuthContext.Provider>
  );
};