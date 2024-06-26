const Alumni = require('../models/Alumni');

exports.getAllAlumni = async (req, res) => {
  try {
    const { batch, profession } = req.query;
    let query = {};

    if (batch) {
      query.batch = batch;
    }
    if (profession) {
      query.profession = profession;
    }

    const alumni = await Alumni.find(query);
    res.json(alumni);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

