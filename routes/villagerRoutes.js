const express = require('express');
const router = express.Router();
const { addVillager,getAllVillagers  } = require('../controllers/villagerController');

router.route('/')
  .get(getAllVillagers)
  .post(addVillager);


module.exports = router;