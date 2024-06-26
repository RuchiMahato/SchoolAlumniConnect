// routes/users.js
const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET current user's profile
router.get('/me', authMiddleware, userController.getUserProfile);

// UPDATE current user's profile
router.put('/me', [authMiddleware, upload.single('profilePicture')], userController.updateUserProfile);

module.exports = router;
