// backend/app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const auth = require('./routes/auth');
const usersRoutes = require('./routes/users');
const alumniRoutes = require('./routes/alumni');
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Enable CORS for all routes
app.use(cors({
  origin: 'https://alumniconnect-32hxb8hh2-ruchi-mahato-s-projects.vercel.app/', // Replace with your frontend's URL
  optionsSuccessStatus: 200,
}));

// Define Routes
app.use('/api/auth', auth);
app.use('/api/users', usersRoutes);
app.use('/api/alumni', alumniRoutes);

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
