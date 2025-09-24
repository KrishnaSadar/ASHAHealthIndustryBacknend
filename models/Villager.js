const mongoose = require('mongoose');

const villagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNo: { type: String, required: true, unique: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  zone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Villager', villagerSchema);