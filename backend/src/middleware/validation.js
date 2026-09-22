const Joi = require('joi');

/**
 * Medicine validation schema
 */
const medicineSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  batchNumber: Joi.string().alphanum().min(1).max(50).required(),
  category: Joi.string().min(1).max(100).required(),
  manufacturer: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).allow('', null),
  quantity: Joi.number().integer().min(0).required(),
  unit: Joi.string().min(1).max(50).default('tablets'),
  price: Joi.number().positive().required(),
  lowStockThreshold: Joi.number().integer().min(0).default(10),
  expiryDate: Joi.date().iso().greater('now').required(),
  manufactureDate: Joi.date().iso().less(Joi.ref('expiryDate')).required()
});

/**
 * User registration validation schema
 */
const userRegistrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  role: Joi.string().valid('admin', 'pharmacist', 'viewer').default('viewer')
});

/**
 * User login validation schema
 */
const userLoginSchema = Joi.object({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required()
});

/**
 * Dispense validation schema
 */
const dispenseSchema = Joi.object({
  quantity: Joi.number().integer().positive().required(),
  notes: Joi.string().max(500).allow('', null)
});

/**
 * Validation middleware factory
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors
      });
    }

    req.validatedBody = value;
    next();
  };
};

module.exports = {
  validate,
  medicineSchema,
  userRegistrationSchema,
  userLoginSchema,
  dispenseSchema
};
