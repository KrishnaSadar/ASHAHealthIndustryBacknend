const mongoose = require('mongoose');

const ashaWorkerSchema = new mongoose.Schema({
  _id: { type: String, alias: 'userId' }, // Allows using 'user_id' as the ID
  passwordHash: { type: String, required: true },
  mobileNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  zone: { type: String, required: true, alias: 'alloted_zone' },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  status: { type: Number, enum: [0, 1], default: 1 }, // 1: on-duty, 0: off-duty
}, { timestamps: true });

module.exports = mongoose.model('AshaWorker', ashaWorkerSchema);