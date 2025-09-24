const express = require('express');
const router = express.Router();
const {
  addWorker,
  deleteWorker,
  setWorkerZone,
  setWorkerStatus,
} = require('../controllers/workerController');
const { protectAdmin, protectWorker } = require('../middleware/authMiddleware');

router.post('/',addWorker);
router.delete('/:workerId',deleteWorker);
router.put('/:workerId/zone',setWorkerZone);
router.put('/:workerId/status',setWorkerStatus); // Or protectWorker for self-update

module.exports = router;