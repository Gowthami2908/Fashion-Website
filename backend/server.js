const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoute = require('./routes/users');
const postRoute = require('./routes/post');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
//app.use(bodyParser.json()); // Parse JSON bodies

const app = express();
app.use(cors()); // To allow cross-origin requests
app.use(bodyParser.json()); 
app.use(express.json()); // To parse JSON data

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Use the auth routes
app.use('/api/auth', authRoutes);

app.use('/api/post',postRoute);

// Use routes
app.use('/api/users', usersRoute);

// Error handling middleware (optional but useful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
