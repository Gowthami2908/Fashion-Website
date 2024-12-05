const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const router = express.Router();
//const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the directory to store the uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
  });  

  const upload = multer({ storage });

// Create a new post
router.post('/create', upload.single('image'), async (req, res) => {
    const { caption, userId } = req.body;
    const imageUrl = req.file.path; // Path to the uploaded image
  
    console.log('Caption:', caption);
    console.log('User ID:', userId);
    console.log('Image URL:', imageUrl);

    if (!caption || !imageUrl || !userId) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
    
    try {
      const newPost = new Post({ caption, imageUrl, postedBy: userId });
      await newPost.save();
  
      // Optionally, you can update the user's posts array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Initialize the posts array if it doesn't exist
      if (!user.posts) {
        user.posts = [];
      }
      user.posts.push(newPost._id);
      await user.save();
  
      res.status(201).json({ message: 'Post created successfully!', post: newPost });
    } catch (err) {
        console.error('Error creating post:',err);
      res.status(400).json({ error: 'Error creating post!' });
    }
  });

router.post('/fetch-all', async (req, res) => {
    try {
      const posts = await Post.find({}).populate('comments.postedBy', 'username'); // Include necessary associations
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

// Like a post
router.post('/like', async (req, res) => {
    const { postId, userId } = req.body;
    if (!postId || !userId) {
        return res.status(400).json({ error: 'Post ID and User ID are required.' });
      }
    try {
        const post = await Post.findById(postId);
        post.likes.push(userId);
        await post.save();
        res.json({ message: 'Post liked!' });
    } catch (err) {
        console.error('Error liking post:', error);
        res.status(400).json({ error: 'Error liking post!' });
    }
});
router.delete('/delete', async (req, res) => {
  try {
    const { postId, userId } = req.body;
    console.log('Post ID:', postId);
    console.log('User ID:', userId);


    // Ensure both postId and userId are provided
    if (!postId || !userId) {
      return res.status(400).json({ message: 'Post ID and User ID are required' });
    }

    // Find and delete the post (ensure the user is authorized to delete the post)
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found or not authorized to delete' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Comment on a post
router.post('/comment', async (req, res) => {
    const { postId, userId, text } = req.body;
    try {
        const post = await Post.findById(postId);
        post.comments.push({ text, postedBy: userId });
        await post.save();
        res.json({ message: 'Comment added!' });
    } catch (err) {
        res.status(400).json({ error: 'Error adding comment!' });
    }
});

module.exports = router;

// Comment on a post
router.post('/comment', async (req, res) => {
    const { postId, userId, text } = req.body;
    try {
        const post = await Post.findById(postId);
        post.comments.push({ text, postedBy: userId });
        await post.save();
        res.json({ message: 'Comment added!' });
    } catch (err) {
        res.status(400).json({ error: 'Error adding comment!' });
    }
});

// Like a post
router.post('/like', async (req, res) => {
    const { postId, userId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
            res.json({ message: 'Post liked!' });
        } else {
            res.status(400).json({ error: 'Post already liked!' });
        }
    } catch (err) {
        res.status(400).json({ error: 'Error liking post!' });
    }
});

