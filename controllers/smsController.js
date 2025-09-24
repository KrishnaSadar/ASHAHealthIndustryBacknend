const asyncHandler = require('express-async-handler');
const Villager = require('../models/Villager');
const PatientRequest = require('../models/PatientRequest');
const DirtyWaterComplaint = require('../models/DirtyWaterComplaint');
const { smsDataSchema } = require('../utils/validationSchemas');
const { zoneToWaterParams, latLngToZone } = require('../utils/placeholder');

/**
 * @desc    Process incoming SMS data and create a complaint
 * @route   POST /api/v1/sms-data
 * @access  Public
 */
const processSmsData = asyncHandler(async (req, res) => {
  // 1. Validate the incoming request body
  const { error, value } = smsDataSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  // 2. Verify the user exists
  const villager = await Villager.findById(value.user_id);
  if (!villager) {
    res.status(404);
    throw new Error('Villager (user) not found');
  }

  // 3. Process based on the 'type' field
  if (value.type === 1) {
    // --- Logic for Patient Request ---
    const { state, district, zone, symptom, age, complaint, days } = value;
    
    // Get water parameters for the zone
    const { ph, turbidity } = zoneToWaterParams(zone);

    // Transform the comma-separated symptom string into an array
    const symptomsArray = symptom.split(',').map(s => s.trim());

    // Create the patient request document
    const patientRequest = await PatientRequest.create({
      userId: villager._id,
      state,
      district,
      zone,
      symptoms: symptomsArray,
      age,
      complaint,
      days,
      ph,
      turbidity,
      status: 1, // Default to unsolved
    });

    res.status(201).json(patientRequest);

  } else if (value.type === 2) {
    // --- Logic for Dirty Water Complaint ---
    const { state, district, zone, photo, complaint } = value;
    
    // Get water parameters
    const { ph, turbidity } = zoneToWaterParams(zone);

    // Create the dirty water complaint document
    const dirtyWaterComplaint = await DirtyWaterComplaint.create({
      userId: villager._id,
      state,
      district,
      zone,
      age: villager.age, // We can get age from the villager document
      photo,
      complaint,
      ph,
      turbidity,
      status: 1, // Default to unsolved
    });

    res.status(201).json(dirtyWaterComplaint);
    
  } else {
    // This case should be caught by validation, but it's good practice to have it
    res.status(400);
    throw new Error('Invalid request type specified.');
  }
});

module.exports = {
  processSmsData,
};