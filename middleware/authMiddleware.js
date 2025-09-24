const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const AshaWorker = require('../models/AshaWorker');

/**
 * Middleware to protect routes accessible only by authenticated ASHA workers.
 * Verifies the JWT from the Authorization header.
 */
const protectWorker = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get worker from the token and attach to request object
      req.worker = await AshaWorker.findById(decoded.id).select('-passwordHash');
      if (!req.worker) {
        res.status(401);
        throw new Error('Not authorized, worker not found');
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

/**
 * Middleware to protect routes accessible only by an admin.
 * Verifies a static admin token from the Authorization header.
 */
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    
    if (token === process.env.ADMIN_TOKEN) {
      next();
    } else {
      res.status(401);
      throw new Error('Not authorized as admin');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});


module.exports = { protectWorker, protectAdmin };