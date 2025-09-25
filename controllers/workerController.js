const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const AshaWorker = require('../models/AshaWorker');
const { 
  addWorkerSchema,
  updateWorkerZoneSchema,
  updateWorkerStatusSchema
} = require('../utils/validationSchemas');

/**
 * @desc    Add a new ASHA worker
 * @route   POST /api/v1/workers
 * @access  Admin
 */
const addWorker = asyncHandler(async (req, res) => {
  const { error, value } = addWorkerSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { user_id, password, mobile_no } = value;

  const workerExists = await AshaWorker.findOne({ $or: [{ _id: user_id }, { mobileNo: mobile_no }] });
  if (workerExists) {
    res.status(400);
    throw new Error('Worker with this ID or mobile number already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const worker = await AshaWorker.create({
    _id: user_id,
    passwordHash,
    mobileNo: mobile_no,
    name: value.name,
    lastName: value.last_name,
    zone: value.alloted_zone,
    age: value.age,
    gender: value.gender,
    status: 1, // Default on-duty
  });

  if (worker) {
    res.status(201).json({
      _id: worker._id,
      name: worker.name,
      zone: worker.zone,
    });
  } else {
    res.status(400);
    throw new Error('Invalid worker data');
  }
});

/**
 * @desc    Delete an ASHA worker
 * @route   DELETE /api/v1/workers/:workerId
 * @access  Admin
 */
const deleteWorker = asyncHandler(async (req, res) => {
  const worker = await AshaWorker.findById(req.params.workerId);

  if (!worker) {
    res.status(404);
    throw new Error('Worker not found');
  }

  await worker.deleteOne();

  res.status(200).json({ success: true });
});

/**
 * @desc    Update a worker's zone
 * @route   PUT /api/v1/workers/:workerId/zone
 * @access  Admin
 */
const setWorkerZone = asyncHandler(async (req, res) => {
  const { error, value } = updateWorkerZoneSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const worker = await AshaWorker.findById(req.params.workerId);
  if (!worker) {
    res.status(404);
    throw new Error('Worker not found');
  }

  worker.zone = value.zone;
  await worker.save();
  
  res.status(200).json({ success: true, workerId: worker._id, newZone: worker.zone });
});

/**
 * @desc    Update a worker's status (on-duty/off-duty)
 * @route   PUT /api/v1/workers/:workerId/status
 * @access  Admin or Worker (self)
 */
const setWorkerStatus = asyncHandler(async (req, res) => {
  const { error, value } = updateWorkerStatusSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const worker = await AshaWorker.findById(req.params.workerId);
  if (!worker) {
    res.status(404);
    throw new Error('Worker not found');
  }

  worker.status = value.status;
  await worker.save();

  res.status(200).json({ success: true, workerId: worker._id, newStatus: worker.status });
});
/**
 * @desc    Get all ASHA workers
 * @route   GET /api/v1/workers
 * @access  Admin
 */
const getAllWorkers = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Find workers, excluding the passwordHash for security
  const workers = await AshaWorker.find({})
    .select('-passwordHash')
    .limit(limit)
    .skip(skip);

  const totalWorkers = await AshaWorker.countDocuments();

  res.status(200).json({
    success: true,
    count: workers.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalWorkers / limit),
      totalWorkers,
    },
    data: workers,
  });
});
module.exports = {
  addWorker,
  deleteWorker,
  setWorkerZone,
  setWorkerStatus,
  getAllWorkers,
};