// src/routes/authRoutes.js
const express = require('express');
const { requireAuth } = require('../middleware');
const { User } = require('../models');

const router = express.Router();

// Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-__v')
      .lean();

    res.status(200).json({
      success: true,
      data: user.getPublicProfile ? user.getPublicProfile() : user
    });

  } catch (error) {
    console.error('Get user profile error:'.red, error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (bio !== undefined) updates.bio = bio;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user.getPublicProfile ? user.getPublicProfile() : user
    });

  } catch (error) {
    console.error('Update profile error:'.red, error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

module.exports = router;