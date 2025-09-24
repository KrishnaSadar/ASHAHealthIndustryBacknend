const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const AshaWorker = require('../models/AshaWorker');
const { workerLoginSchema } = require('../utils/validationSchemas');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Authenticate/Login an ASHA worker
 * @route   POST /api/v1/auth/worker/login
 * @access  Public
 */
const loginWorker = asyncHandler(async (req, res) => {
  const { error, value } = workerLoginSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  
  const { user_id, password } = value;

  const worker = await AshaWorker.findById(user_id);

  if (worker && (await bcrypt.compare(password, worker.passwordHash))) {
    res.json({
      _id: worker._id,
      name: worker.name,
      zone: worker.zone,
      token: generateToken(worker._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

module.exports = {
  loginWorker,
};