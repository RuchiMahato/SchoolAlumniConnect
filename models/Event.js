// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  registrationLink: {
    type: String, // Store the URL for the registration form
  },
});

module.exports = mongoose.model('Event', EventSchema);
