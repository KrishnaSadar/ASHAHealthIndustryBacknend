const asyncHandler = require('express-async-handler');
const ZonePrediction = require('../models/ZonePrediction');
const { callMlPredictionApi } = require('../utils/placeholder');
const { triggerPredictionSchema } = require('../utils/validationSchemas');

/**
 * @desc    Manually trigger prediction for zones
 * @route   POST /api/v1/predictions/trigger
 * @access  Public
 */
const triggerPrediction = asyncHandler(async (req, res) => {
  const { error, value: payload } = triggerPredictionSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  // Call the external/placeholder API
  const predictionResponse = await callMlPredictionApi(payload);

  // Store the results. One document per zone in the payload.
  const predictionDocs = payload.map(zoneData => ({
    zone: zoneData.zone,
    payloadSent: zoneData,
    predictionResponse: predictionResponse, // Store the full raw response for analysis
    receivedAt: new Date(),
  }));
  
  const savedPredictions = await ZonePrediction.insertMany(predictionDocs);
  
  res.status(200).json(savedPredictions);
});

/**
 * @desc    Get the most recent prediction for a specific zone
 * @route   GET /api/v1/predictions/:zone
 * @access  Public
 */
const getZonePrediction = asyncHandler(async (req, res) => {
  const { zone } = req.params;

  const prediction = await ZonePrediction.findOne({ zone })
    .sort({ receivedAt: -1 }); // Get the latest one

  if (!prediction) {
    res.status(404);
    throw new Error(`No prediction found for zone: ${zone}`);
  }
  
  res.status(200).json(prediction);
});


module.exports = {
  triggerPrediction,
  getZonePrediction,
};