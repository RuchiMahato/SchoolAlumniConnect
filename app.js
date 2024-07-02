require('dotenv').config();
process.env.NODE_CONFIG_STRICT_MODE = true;
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const config = require('config');

const auth = require('./routes/auth');
const usersRoutes = require('./routes/users');
const alumniRoutes = require('./routes/alumni');
const eventRoutes = require('./routes/events');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect Database
connectDB();

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

// Init Middleware
app.use(express.json({ extended: false }));

// Allowed origins for CORS
const allowedOrigins = [
  'https://alumniconnect-theta.vercel.app', // Production URL
  'http://localhost:5173' // Development URL
];

// Enable CORS for all routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
}));

// Define Routes
app.use('/api/auth', auth);
app.use('/api/users', usersRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Use environment variable for port, fallback to config if not set
const PORT = process.env.PORT || config.get('port') || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));