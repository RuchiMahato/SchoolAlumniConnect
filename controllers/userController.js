const User = require('../models/User');
const Alumni = require('../models/Alumni');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User profile not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateUserProfile = async (req, res) => {
  const { name, profession, batch, linkedinUrl, emailId } = req.body;

  const profileFields = { name, profession, batch, linkedinUrl, emailId };

  if (req.file) {
    profileFields.profilePicture = `/uploads/${req.file.filename}`;
  }

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user profile
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    );

    // Check if an Alumni profile already exists for this user
    let alumni = await Alumni.findOne({ userId: user._id });

    if (alumni) {
      // If Alumni profile exists, update it
      alumni = await Alumni.findOneAndUpdate(
        { userId: user._id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // If Alumni profile does not exist, create a new one
      profileFields.userId = user._id; // Link Alumni profile to User
      alumni = new Alumni(profileFields);
      await alumni.save();
    }

    res.json({ user, alumni });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};