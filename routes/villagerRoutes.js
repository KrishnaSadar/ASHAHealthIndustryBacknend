const express = require('express');
const router = express.Router();
const { addVillager } = require('../controllers/villagerController');

router.post('/', addVillager);

module.exports = router;