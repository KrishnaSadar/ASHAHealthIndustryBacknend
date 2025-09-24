// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { startPredictionJob } = require('./services/predictionService');

// --- DATABASE CONNECTION ---
connectDB();

// --- EXPRESS APP INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- GLOBAL MIDDLEWARE ---
// Enable CORS for all origins
app.use(cors());
// Parse JSON bodies
app.use(express.json());
// Logger for HTTP requests in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// --- API ROUTES ---
app.get('/', (req, res) => {
  res.json({ message: "API is running..." });
});

app.use('/api/v1/villagers', require('./routes/villagerRoutes'));
app.use('/api/v1', require('./routes/complaintRoutes'));
app.use('/api/v1/workers', require('./routes/workerRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/predictions', require('./routes/predictionRoutes'));
app.use('/api/v1/help-requests', require('./routes/helpRequestRoutes'));


// --- CUSTOM ERROR HANDLING MIDDLEWARE ---
app.use(errorHandler);

// --- SERVER LISTENER ---
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  // Start the hourly prediction cron job if enabled
  startPredictionJob();
});

// Export the app for serverless environments
module.exports = app;