// src/config/clerk.js - TEMPORARY VERSION
console.log('⚠️  Clerk configuration: Development mode - using mock authentication'.yellow);

// Mock Clerk client for development
const mockClerkClient = {
  verifyToken: async (token) => {
    console.log('🔐 Development: Mock token verification');
    // Return mock user data
    return {
      sub: 'user_dev_123',
      username: 'devuser',
      email_addresses: [{ email_address: 'dev@bloghub.com' }],
      first_name: 'Development',
      last_name: 'User',
      profile_image_url: null
    };
  }
};

module.exports = mockClerkClient;