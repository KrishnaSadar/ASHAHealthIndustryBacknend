const express = require('express');
const router = express.Router();
const { processSmsData } = require('../controllers/smsController');

router.post('/', processSmsData);

module.exports = router;