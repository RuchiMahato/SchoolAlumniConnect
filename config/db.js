require('dotenv').config(); // Ensure this is at the top to load environment variables
const mongoose = require('mongoose');
const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!db) {
      throw new Error('MONGO_URI is not defined');
    }
    console.log(`Connecting to MongoDB with URI: ${db}`); // Add this line to debug
    await mongoose.connect(db);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


