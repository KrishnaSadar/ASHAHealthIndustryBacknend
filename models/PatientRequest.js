const mongoose = require('mongoose');

const patientRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Villager', required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  zone: { type: String, required: true },
  symptoms: [{ type: String }],
  age: { type: Number, required: true },
  complaint: { type: String, required: true },
  status: { type: Number, required: true, enum: [1, 2, 3], default: 1 }, // 1: unsolved, 2: pending, 3: solved
  days: { type: Number, required: true },
  ph: { type: Number, required: true },
  turbidity: { type: Number, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: true } });

module.exports = mongoose.model('PatientRequest', patientRequestSchema);