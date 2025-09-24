const express = require('express');
const router = express.Router();
const { loginWorker } = require('../controllers/authController');

router.post('/worker/login', loginWorker);

module.exports = router;