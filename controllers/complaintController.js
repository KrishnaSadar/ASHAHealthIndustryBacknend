const asyncHandler = require('express-async-handler');
const PatientRequest = require('../models/PatientRequest');
const DirtyWaterComplaint = require('../models/DirtyWaterComplaint');
const Villager = require('../models/Villager');
const {
  addPatientRequestSchema,
  addDirtyWaterComplaintSchema,
  updateComplaintStatusSchema,
  paginationQuerySchema,
} = require('../utils/validationSchemas');
const { zoneToWaterParams, latLngToZone } = require('../utils/placeholder');

/**
 * @desc    Add a new patient request (complaint)
 * @route   POST /api/v1/patient-requests
 * @access  Public
 */
const addPatientRequest = asyncHandler(async (req, res) => {
  const { error, value } = addPatientRequestSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const villager = await Villager.findById(value.user_id);
  if (!villager) {
    res.status(404);
    throw new Error('Villager (user) not found');
  }

  let effectiveZone = value.zone;
  if (!effectiveZone) {
    effectiveZone = latLngToZone(villager.latitude, villager.longitude);
  }

  const { ph, turbidity } = zoneToWaterParams(effectiveZone);

  const patientRequest = await PatientRequest.create({
    ...value,
    userId: value.user_id,
    zone: effectiveZone,
    ph,
    turbidity,
    status: 1, // Default to unsolved
    createdAt: new Date(),
  });

  res.status(201).json(patientRequest);
});

/**
 * @desc    Add a new dirty water complaint
 * @route   POST /api/v1/dirty-water-complaints
 * @access  Public
 */
const addDirtyWaterComplaint = asyncHandler(async (req, res) => {
    const { error, value } = addDirtyWaterComplaintSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }
    
    const villager = await Villager.findById(value.user_id);
    if (!villager) {
        res.status(404);
        throw new Error('Villager (user) not found');
    }
    
    const { ph, turbidity } = zoneToWaterParams(value.zone);

    const complaint = await DirtyWaterComplaint.create({
        ...value,
        userId: value.user_id,
        ph,
        turbidity,
        status: 1, // Default to unsolved
        createdAt: new Date(),
    });

    res.status(201).json(complaint);
});

/**
 * @desc    Update the status of any complaint
 * @route   PUT /api/v1/complaints/:complaintId/status
 * @access  Public (or Protected via Worker/Admin)
 */
const updateComplaintStatus = asyncHandler(async (req, res) => {
    const { error, value } = updateComplaintStatusSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }
    
    const { complaintId } = req.params;
    const { status } = value;
    
    let complaint = await PatientRequest.findById(complaintId);
    if (!complaint) {
        complaint = await DirtyWaterComplaint.findById(complaintId);
    }

    if (!complaint) {
        res.status(404);
        throw new Error('Complaint not found');
    }
    
    complaint.status = status;
    await complaint.save();
    
    // Log the notification TODO
    console.log(`TODO: Send push notification to user with ID: ${complaint.userId}`);
    
    res.status(200).json({
        success: true,
        notifiedUserId: complaint.userId,
    });
});

/**
 * @desc    Get all patient requests with filtering and pagination
 * @route   GET /api/v1/patient-requests
 * @access  Public
 */
const getPatientRequests = asyncHandler(async (req, res) => {
    const { error, value } = paginationQuerySchema.validate(req.query);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { zone, status, limit, page } = value;
    const query = {};
    if (zone) query.zone = zone;
    if (status) query.status = status;

    const complaints = await PatientRequest.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await PatientRequest.countDocuments(query);
    
    res.status(200).json({
        success: true,
        count: complaints.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: complaints,
    });
});

/**
 * @desc    Get all dirty water complaints with filtering and pagination
 * @route   GET /api/v1/dirty-water-complaints
 * @access  Public
 */
const getDirtyWaterComplaints = asyncHandler(async (req, res) => {
    const { error, value } = paginationQuerySchema.validate(req.query);
     if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { zone, status, limit, page } = value;
    const query = {};
    if (zone) query.zone = zone;
    if (status) query.status = status;

    const complaints = await DirtyWaterComplaint.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await DirtyWaterComplaint.countDocuments(query);
    
    res.status(200).json({
        success: true,
        count: complaints.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: complaints,
    });
});

module.exports = {
  addPatientRequest,
  addDirtyWaterComplaint,
  updateComplaintStatus,
  getPatientRequests,
  getDirtyWaterComplaints,
};