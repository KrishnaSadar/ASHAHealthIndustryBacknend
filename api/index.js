const serverless = require('serverless-http');
const app = require('../index'); // Import the configured express app

// Vercel requires a single handler export
module.exports = serverless(app);