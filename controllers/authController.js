// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
const User = require('../models/User');

//register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    user = new User({
      name,
      email,
      password: hashedPassword
    });
  
    // Save user
    await user.save();

    console.log(`User registered: ${email}`);
    console.log(`Hashed password at registration: ${hashedPassword}`);

    // Verify the saved password
    const savedUser = await User.findOne({ email });
    console.log(`Saved hashed password: ${savedUser.password}`);

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign JWT and return token
    jwt.sign(
      payload,
      jwtSecret,
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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found`);
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Log user details (remove in production)
    console.log(`User found: ${user.email}`);
    console.log(`Stored hashed password: ${user.password}`);
    console.log(`Password from request: ${password}`);

    // Compare password
    console.log(`Comparing password for user ${user.email}`);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match result: ${isMatch}`);

    if (!isMatch) {
      console.log(`Password does not match for user ${user.email}`);
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Password matched, create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign JWT and return token
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send('Server error');
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};