// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String
  },
  profession: {
    type: String
  },
  batch: {
    type: Number
  },
  linkedinUrl: {
    type: String
  },
  gmailAccount: {
    type: String
  }
});

module.exports = mongoose.model('User', UserSchema);

