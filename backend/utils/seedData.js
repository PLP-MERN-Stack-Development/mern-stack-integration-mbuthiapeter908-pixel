// src/utils/seedData.js
const { User, Category, Post } = require('../models');
const mongoose = require('mongoose');

const sampleUsers = [
  {
    clerkUserId: 'user_1',
    username: 'admin',
    email: 'admin@bloghub.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    clerkUserId: 'user_2', 
    username: 'johndoe',
    email: 'john@bloghub.com',
    firstName: 'John',
    lastName: 'Doe'
  }
];

const sampleCategories = [
  {
    name: 'Technology',
    description: 'Latest in tech and programming'
  },
  {
    name: 'Lifestyle',
    description: 'Life tips and personal development'
  },
  {
    name: 'Travel',
    description: 'Adventure stories and travel guides'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});

    console.log('✅ Existing data cleared');

    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ ${createdUsers.length} users created`);

    // Update categories with user references
    const categoriesWithUsers = sampleCategories.map(category => ({
      ...category,
      createdBy: createdUsers[0]._id
    }));

    // Create categories
    const createdCategories = await Category.insertMany(categoriesWithUsers);
    console.log(`✅ ${createdCategories.length} categories created`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Sample Data Created:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📂 Categories: ${createdCategories.length}`);
    console.log(`   📝 Posts: 0 (You can create posts via the API)`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Only run if called directly
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../config/database');
  
  connectDB().then(() => {
    seedDatabase().then(() => {
      mongoose.connection.close();
    });
  });
}

module.exports = seedDatabase;