const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

// Route to fetch user data and their posts by username using POST
router.post('/profile', async (req, res) => {
  const { username } = req.body; // Extract username from the request body
  console.log('Request received at /api/users/profile');
  console.log('Request body:', req.body);
  try {
    // Find the user by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the posts created by this user
    const posts = await Post.find({ postedBy: user._id });

    // Return the user data and their posts
    res.status(200).json({ user, posts });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
