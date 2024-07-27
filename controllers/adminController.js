// controllers/adminController.js
// controllers/adminController.js
/*const Event = require('../models/Event');
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

    // Send a success message instead of a token
    res.status(201).json({ msg: 'Admin registered successfully' });
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
    console.log('Attempting to delete event with ID:', eventId);

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

module.exports = exports;*/


// controllers/adminController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const Admin = require('../models/Admin');
const Event = require('../models/Event');
const adminJwtSecret = config.get('adminJwtSecret');
const { validationResult } = require('express-validator');
const Alumni = require('../models/Alumni');

exports.adminRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ errors: [{ msg: 'Admin already exists' }] });
    }

    admin = new Admin({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    const payload = {
      admin: {
        id: admin.id
      }
    };

    jwt.sign(
      payload,
      config.get('adminJwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const payload = {
      admin: {
        id: admin.id
      }
    };

    jwt.sign(
      payload,
      config.get('adminJwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
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
    console.log('Attempting to delete event with ID:', eventId);

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

// controllers/adminController.js
exports.verifyAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await Alumni.findByIdAndUpdate(id, { verified: true }, { new: true });

    if (!alumni) {
      return res.status(404).json({ msg: 'Alumni not found' });
    }

    res.json(alumni);
  } catch (err) {
    console.error('Error verifying alumni:', err);
    res.status(500).send('Server Error');
  }
};


module.exports = exports;

// Add other admin-related controller functions here (createEvent, getEvents, deleteEvent)