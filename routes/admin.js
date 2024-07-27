/*const express = require('express');
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

module.exports = router;*/

//routes/admin.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');
const Alumni = require('../models/Alumni'); // Import your Alumni model
const eventController = require('../controllers/eventController');
const upload = require('../middleware/uploadMiddleware');

const { 
  adminLogin, 
  createEvent, 
  getEvents, 
  adminRegister, 
  getAdminProfile,
  deleteEvent,
  updateEvent,
  verifyAlumni // Added for completeness
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
router.put('/events/:id', eventController.updateEvent); // Added route for updating events
router.delete('/events/:id', adminMiddleware, deleteEvent);

// New routes for alumni
router.get('/alumni', adminMiddleware, async (req, res) => {
  try {
    const alumni = await Alumni.find(); // Replace with your data retrieval logic
    console.log('Alumni data:', alumni); 
    res.json(alumni);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/alumni', upload.single('profilePic'), async (req, res) => {
  try {
    const { name, batch } = req.body;
    const profilePic = `/uploads/${req.file.filename}`;

    const newAlumni = new Alumni({
      name,
      batch,
      profilePic
    });

    await newAlumni.save();
    res.status(201).json(newAlumni);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create alumni' });
  }
});


router.delete('/alumni/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Alumni.findByIdAndDelete(id); // Replace with your data deletion logic
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.put('/alumni/verify/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await Alumni.findById(id);
    
    if (!alumni) {
      return res.status(404).json({ msg: 'Alumni not found' });
    }

    alumni.verified = true; // or whatever field represents verification
    await alumni.save();
    
    res.json(alumni);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/alumni/verify/:id', adminMiddleware, adminController.verifyAlumni);

module.exports = router;
