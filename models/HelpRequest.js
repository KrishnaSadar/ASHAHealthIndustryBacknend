const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  workerId: { type: String, ref: 'AshaWorker', required: false }, // Worker ID is optional
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);