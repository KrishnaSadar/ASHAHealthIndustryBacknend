const cron = require('node-cron');
const AshaWorker = require('../models/AshaWorker');
const ZonePrediction = require('../models/ZonePrediction');
const PatientRequest = require('../models/PatientRequest');
const { callMlPredictionApi, zoneToWaterParams } = require('../utils/placeholder');

/**
 * Gathers data for each distinct zone, calls the ML API, and saves the prediction.
 */
const runPredictionForZones = async () => {
  console.log('🤖 Starting hourly prediction job...');
  try {
    // 1. Get a list of unique zones from active workers
    const zones = await AshaWorker.distinct('zone', { status: 1 });
    if (zones.length === 0) {
      console.log('No active zones found to run predictions for.');
      return;
    }

    // 2. For each zone, construct the payload
    const predictionPayloads = await Promise.all(
      zones.map(async (zone) => {
        // Get recent symptoms from patient requests in this zone
        const recentSymptoms = await PatientRequest.distinct('symptoms', {
          zone: zone,
          createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
        });

        // Get water parameters for the zone
        const { ph, turbidity } = zoneToWaterParams(zone);

        return {
          zone,
          symptoms: recentSymptoms.flat(), // Flatten array of arrays
          ph,
          turbidity,
        };
      })
    );

    // 3. Call the ML Prediction API
    const predictionResponse = await callMlPredictionApi(predictionPayloads);
    
    // 4. Save the results to the database
    const predictionDocs = predictionPayloads.map(payload => ({
      zone: payload.zone,
      payloadSent: payload,
      predictionResponse: predictionResponse,
      receivedAt: new Date(),
    }));

    await ZonePrediction.insertMany(predictionDocs);
    console.log(`✅ Successfully saved predictions for ${zones.length} zones.`);

  } catch (error) {
    console.error('❌ Error during hourly prediction job:', error);
  }
};

/**
 * Initializes and starts the cron job if it is enabled.
 */
const startPredictionJob = () => {
  if (process.env.ENABLE_PREDICTION_JOB === 'true') {
    // Schedule to run at the top of every hour
    cron.schedule('0 * * * *', runPredictionForZones);
    console.log('🕒 Hourly prediction job is scheduled.');
  } else {
    console.log('🚫 Hourly prediction job is disabled.');
  }
};

module.exports = { startPredictionJob, runPredictionForZones };