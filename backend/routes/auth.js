const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
  // Log the request body to see what is being sent from the frontend
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  const { username, password } = req.body;

  // Check if both fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter both username and password' });
  }

  try {
    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    console.log('Stored password:', user.password);
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If credentials are valid, return success
    console.log('Login successful for user:', username);
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


// User registration route
router.post('/signup', async (req, res) => {
  // Log incoming data
    // Log request headers
  console.log('Request body:', req.body);

  const { username, email, password, confirmPassword, firstName, lastName, phone, bio, city, gender, dob } = req.body;

  // Check if required fields are present
  if (!username || !email || !password || !firstName || !lastName) {
    console.log('Missing required fields');
    return res.status(400).json({ message: "Please fill out all required fields" });
  }

  try {
    
    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password, // Store hashed password
      firstName,
      lastName,
      phone,
      bio,
      city,
      gender,
      dob,
    });

    await newUser.save();
    console.log('User registered successfully');
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
