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
    createdAt: new Date(),
  });
  
  res.status(201).json({
    success: true,
    helpRequestId: helpRequest._id,
  });
});

module.exports = {
  addHelpRequest,
};