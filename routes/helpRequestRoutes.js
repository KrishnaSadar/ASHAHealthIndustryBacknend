const express = require('express');
const router = express.Router();
const { addHelpRequest } = require('../controllers/helpRequestController');
const { protectWorker } = require('../middleware/authMiddleware');

// protectWorker is optional. If present, it attaches req.worker
// If not present, the endpoint still works but workerId won't be auto-populated
router.post('/', addHelpRequest);

module.exports = router;