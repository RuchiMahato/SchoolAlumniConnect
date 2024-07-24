// controllers/eventController.js
/*const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { name, date, description, registrationLink } = req.body;
    const newEvent = new Event({ name, date, description, registrationLink });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by date in ascending order
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};*/

const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { name, date, description, registrationLink } = req.body;
    // Validate input
    if (!name || !date || !description) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    const newEvent = new Event({ name, date, description, registrationLink });
    const event = await newEvent.save();
    res.status(201).json(event); // Return 201 for resource creation
  } catch (err) {
    console.error('Error creating event:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by date in ascending order
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, description, registrationLink } = req.body;

    // Validate input
    if (!name || !date || !description) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { name, date, description, registrationLink },
      { new: true } // Return the updated event
    );

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error('Error updating event:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

