const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

const { 
  adminLogin, 
  createEvent, 
  getEvents, 
  adminRegister, 
  getAdminProfile,
  deleteEvent
} = require('../controllers/adminController');

// Admin registration route with input validation

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  adminController.adminRegister
);

router.post('/login', adminLogin);
router.get('/me', adminMiddleware, getAdminProfile);
router.post('/events', adminMiddleware, createEvent);
router.get('/events', adminMiddleware, getEvents);
router.delete('/events/:id', adminMiddleware, deleteEvent);
router.get('/all', async (req, res) => {
  try {
    const Admin = require('../models/Admin');
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;