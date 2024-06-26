// routes/alumni.js
const express = require('express');
const router = express.Router();
const Alumni = require('../models/Alumni');
const alumniController = require('../controllers/alumniController');

router.get('/', alumniController.getAllAlumni);

module.exports = router;

