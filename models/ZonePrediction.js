const mongoose = require('mongoose');

const zonePredictionSchema = new mongoose.Schema({
  zone: { type: String, required: true, index: true },
  payloadSent: { type: mongoose.Schema.Types.Mixed, required: true },
  predictionResponse: { type: mongoose.Schema.Types.Mixed, required: true },
  receivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ZonePrediction', zonePredictionSchema);