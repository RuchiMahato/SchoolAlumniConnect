const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: String,
  profession: String,
  batch: Number,
  linkedinUrl: String,
  emailId: String,
  profilePicture: String,
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Alumni', AlumniSchema);