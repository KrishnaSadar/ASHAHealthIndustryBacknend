const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the URI from environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
     const conn = await mongoose.connect(process.env.MONGO_URI);
    console.error(`MongoDB Connection Error: ${conn}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;