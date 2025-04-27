const mongoose = require('mongoose');
require('dotenv').config(); // Ensure you load the .env file

const mongoURI = process.env.MONGO_URI; // Get the URI from environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if DB connection fails
  }
};

module.exports = connectDB; // Export as a commonJS module
