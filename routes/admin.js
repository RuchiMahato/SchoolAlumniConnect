const express = require('express');
const router = express.Router();
const { 
  adminLogin, 
  createEvent, 
  getEvents, 
  adminRegister, 
  getAdminProfile,
  deleteEvent
} = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/register', adminRegister);
router.post('/login', adminLogin);
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
router.get('/me', adminMiddleware, getAdminProfile);

module.exports = router;