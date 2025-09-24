const express = require('express');
const router = express.Router();
const {
  triggerPrediction,
  getZonePrediction,
} = require('../controllers/predictionController');

router.post('/trigger', triggerPrediction);
router.get('/:zone', getZonePrediction);

module.exports = router;