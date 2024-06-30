// controllers/adminController.js
// controllers/adminController.js
const Event = require('../models/Event');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

exports.adminRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin = new Admin({
      email,
      password: hashedPassword
    });

    await admin.save();

    const payload = {
      admin: {
        id: admin.id,
        role: 'admin'
      }
    };

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      admin: {
        id: admin.id,
        role: 'admin'
      }
    };

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAdminProfile = (req, res) => {
  res.json(req.admin);
};

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
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log('Attempting to delete event with ID:', eventId); // Add this line

    if (!eventId) {
      return res.status(400).json({ msg: 'Event ID is required' });
    }

    const event = await Event.findByIdAndDelete(eventId);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json({ msg: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error in deleteEvent:', err.message);
    res.status(500).send('Server Error');
  }
};


module.exports = exports;