// backend/app.js
require('dotenv').config()
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const auth = require('./routes/auth');
const usersRoutes = require('./routes/users');
const app = express();
const alumniRoutes = require('./routes/alumni');

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  optionsSuccessStatus: 200,
}));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/alumni', require('./routes/alumni'));

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
