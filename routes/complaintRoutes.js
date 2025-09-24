const express = require('express');
const router = express.Router();
const {
  addPatientRequest,
  addDirtyWaterComplaint,
  updateComplaintStatus,
  getPatientRequests,
  getDirtyWaterComplaints,
} = require('../controllers/complaintController');

// Handles GET and POST for /api/v1/patient-requests
router.route('/patient-requests').post(addPatientRequest).get(getPatientRequests);

// Handles GET and POST for /api/v1/dirty-water-complaints
router.route('/dirty-water-complaints').post(addDirtyWaterComplaint).get(getDirtyWaterComplaints);

// Handles PUT for /api/v1/complaints/:complaintId/status
router.put('/complaints/:complaintId/status', updateComplaintStatus);

module.exports = router;