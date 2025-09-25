const asyncHandler = require('express-async-handler');
const Villager = require('../models/Villager');
const { addVillagerSchema } = require('../utils/validationSchemas');
const { latLngToZone } = require('../utils/placeholder');

/**
 * @desc    Add a new villager
 * @route   POST /api/v1/villagers
 * @access  Public
 */
const addVillager = asyncHandler(async (req, res) => {
  // 1. Validate request body
  const { error, value } = addVillagerSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { mobile_no, name, last_name, latitude, longitude, age, gender } = value;

  // 2. Check if villager already exists
  const villagerExists = await Villager.findOne({ mobileNo: mobile_no });
  if (villagerExists) {
    res.status(400);
    throw new Error('Villager with this mobile number already exists');
  }

  // 3. Compute zone from latitude and longitude
  const zone = latLngToZone(latitude, longitude);

  // 4. Create Villager document
  const villager = await Villager.create({
    mobileNo: mobile_no,
    name,
    lastName: last_name,
    latitude,
    longitude,
    age,
    gender,
    zone, // Add the computed zone
  });

  // 5. Respond
  if (villager) {
    res.status(201).json({
      success: true,
      villagerId: villager._id,
    });
  } else {
    res.status(400);
    throw new Error('Invalid villager data');
  }
});
/**
 * @desc    Get all villagers with pagination
 * @route   GET /api/v1/villagers
 * @access  Public
 */
const getAllVillagers = asyncHandler(async (req, res) => {
  // Set up pagination from query parameters or use defaults
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Fetch villagers and the total count for pagination metadata
  const villagers = await Villager.find({}).limit(limit).skip(skip);
  const totalVillagers = await Villager.countDocuments();

  res.status(200).json({
    success: true,
    count: villagers.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalVillagers / limit),
      totalVillagers,
    },
    data: villagers,
  });
});
module.exports = {
  addVillager,
  getAllVillagers,
};