const Joi = require('joi');

const mobileRegex = /^[6-9]\d{9}$/;

// Villager validation
const addVillagerSchema = Joi.object({
  mobile_no: Joi.string().pattern(mobileRegex).required(),
  name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  age: Joi.number().integer().min(0).max(120).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
});

// Complaint validation
const addPatientRequestSchema = Joi.object({
  user_id: Joi.string().hex().length(24).required(),
  state: Joi.string().required(),
  district: Joi.string().required(),
  zone: Joi.string().optional(), // Can be derived if not provided
  symptoms: Joi.array().items(Joi.string()).min(1).required(),
  age: Joi.number().integer().min(0).required(),
  complaint: Joi.string().min(10).required(),
  days: Joi.number().integer().min(1).required(),
});

const addDirtyWaterComplaintSchema = Joi.object({
  user_id: Joi.string().hex().length(24).required(),
  state: Joi.string().required(),
  district: Joi.string().required(),
  zone: Joi.string().required(),
  age: Joi.number().integer().min(0).required(),
  complaint: Joi.string().min(10).required(),
  photo: Joi.string().uri().required(),
});

const updateComplaintStatusSchema = Joi.object({
  status: Joi.number().valid(1, 2, 3).required(),
});

// Worker validation
const addWorkerSchema = Joi.object({
  user_id: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  mobile_no: Joi.string().pattern(mobileRegex).required(),
  name: Joi.string().required(),
  last_name: Joi.string().required(),
  alloted_zone: Joi.string().required(),
  age: Joi.number().integer().min(18).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
});

const workerLoginSchema = Joi.object({
  user_id: Joi.string().required(),
  password: Joi.string().required(),
});

const updateWorkerZoneSchema = Joi.object({
  zone: Joi.string().required(),
});

const updateWorkerStatusSchema = Joi.object({
  status: Joi.number().valid(0, 1).required(),
});

// Prediction validation
const triggerPredictionSchema = Joi.array().items(
  Joi.object({
    zone: Joi.string().required(),
    symptoms: Joi.array().items(Joi.string()).required(),
    ph: Joi.number().required(),
    turbidity: Joi.number().required(),
  })
).min(1);

// Help Request validation
const addHelpRequestSchema = Joi.object({
  zone: Joi.string().required(),
  workerId: Joi.string().optional(), // Can be inferred from token
  doctorsRequired: Joi.number().integer().min(1).required(), // Add this line
});

// Generic pagination query validation
const paginationQuerySchema = Joi.object({
    zone: Joi.string().optional(),
    status: Joi.number().valid(1, 2, 3).optional(),
    limit: Joi.number().integer().min(1).max(100).default(10),
    page: Joi.number().integer().min(1).default(1),
});
// Add this schema inside utils/validationSchemas.js
const smsDataSchema = Joi.object({
  user_id: Joi.string().hex().length(24).required(),
  type: Joi.number().valid(1, 2).required(),
  state: Joi.string().required(),
  district: Joi.string().required(),
  zone: Joi.string().required(),
  
  // Fields for type 1 (Patient Request)
  symptom: Joi.string().when('type', { is: 1, then: Joi.required() }),
  age: Joi.number().integer().min(0).when('type', { is: 1, then: Joi.required() }),
  complaint: Joi.string().when('type', { is: 1, then: Joi.string().min(10).required(), otherwise: Joi.optional() }),
  days: Joi.number().integer().min(1).when('type', { is: 1, then: Joi.required() }),
  
  // Fields for type 2 (Dirty Water)
  photo: Joi.string().uri().when('type', { is: 2, then: Joi.required() }),
});


module.exports = {
  smsDataSchema,
  addVillagerSchema,
  addPatientRequestSchema,
  addDirtyWaterComplaintSchema,
  updateComplaintStatusSchema,
  addWorkerSchema,
  workerLoginSchema,
  updateWorkerZoneSchema,
  updateWorkerStatusSchema,
  triggerPredictionSchema,
  addHelpRequestSchema,
  paginationQuerySchema,
};