// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', authController.login);

module.exports = router;