const asyncHandler = require('express-async-handler');
const HelpRequest = require('../models/HelpRequest');
const { addHelpRequestSchema } = require('../utils/validationSchemas');

/**
 * @desc    Create a new help request
 * @route   POST /api/v1/help-requests
 * @access  Public or Worker (if authenticated)
 */
const addHelpRequest = asyncHandler(async (req, res) => {
  // If a worker is logged in, their ID is available on req.worker
  const workerId = req.worker ? req.worker._id : req.body.workerId;
  
  const { error, value } = addHelpRequestSchema.validate({ ...req.body, workerId });
   if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  
  const helpRequest = await HelpRequest.create({
    zone: value.zone,
    workerId: value.workerId, // Optional
     doctorsRequired: value.doctorsRequired, // Add this line
    createdAt: new Date(),
  });
  
  res.status(201).json({
    success: true,
    helpRequestId: helpRequest._id,
  });
});
/**
 * @desc    Delete a help request
 * @route   DELETE /api/v1/help-requests/:id
 * @access  Admin
 */
const deleteHelpRequest = asyncHandler(async (req, res) => {
  const helpRequest = await HelpRequest.findById(req.params.id);

  if (!helpRequest) {
    res.status(404);
    throw new Error('Help request not found');
  }

  await helpRequest.deleteOne();

  res.status(200).json({ success: true, message: 'Help request deleted' });
});
/**
 * @desc    Get all help requests
 * @route   GET /api/v1/help-requests
 * @access  Admin
 */
const getAllHelpRequests = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Find all help requests, sort by most recent
  // Populate worker details, excluding their password
  const helpRequests = await HelpRequest.find({})
    .sort({ createdAt: -1 })
    .populate('workerId', 'name mobileNo zone') // Get worker's name, mobile, and zone
    .limit(limit)
    .skip(skip);

  const totalHelpRequests = await HelpRequest.countDocuments();

  res.status(200).json({
    success: true,
    count: helpRequests.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalHelpRequests / limit),
      total: totalHelpRequests,
    },
    data: helpRequests,
  });
});

module.exports = {
  addHelpRequest,
   deleteHelpRequest, 
   getAllHelpRequests,
};