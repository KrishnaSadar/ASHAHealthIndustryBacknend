const mongoose = require('mongoose');

const dirtyWaterComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Villager', required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  zone: { type: String, required: true },
  age: { type: Number, required: true },
  complaint: { type: String, required: true },
  status: { type: Number, required: true, enum: [1, 2, 3], default: 1 }, // 1: unsolved, 2: pending, 3: solved
  photo: { type: String, required: true }, // URL
  ph: { type: Number, required: true },
  turbidity: { type: Number, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: true } });

module.exports = mongoose.model('DirtyWaterComplaint', dirtyWaterComplaintSchema);