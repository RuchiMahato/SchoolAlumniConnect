// routes/events.js
// routes/events.js
/*const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const adminMiddleware = require('../middleware/adminMiddleware');

// Route to create an event (admin only)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { name, date, description } = req.body;
    const newEvent = new Event({ name, date, description });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to get all events (open to all users)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by date in ascending order
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const adminMiddleware = require('../middleware/adminMiddleware');
const { createEvent, getEvents, updateEvent } = require('../controllers/eventController');

// Route to create an event (admin only)
router.post('/', adminMiddleware, createEvent);

// Route to get all events (open to all users)
router.get('/', getEvents);

// Route to update an event (admin only)
router.put('/:id', adminMiddleware, updateEvent);

module.exports = router;

