const express = require('express');
const router = express.Router();
const { addHelpRequest, deleteHelpRequest ,getAllHelpRequests } = require('../controllers/helpRequestController');
// const { protectWorker } = require('../middleware/authMiddleware');

// protectWorker is optional. If present, it attaches req.worker
// If not present, the endpoint still works but workerId won't be auto-populated
router.post('/', addHelpRequest);
// Add this new route for deleting
// Route for admins to get all help requests
router.get('/',getAllHelpRequests);
router.delete('/:id', deleteHelpRequest);
module.exports = router;