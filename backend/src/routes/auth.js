const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validate, userRegistrationSchema, userLoginSchema } = require('../middleware/validation');

// Public routes
router.post('/register', validate(userRegistrationSchema), authController.register);
router.post('/login', validate(userLoginSchema), authController.login);

// Protected routes
router.get('/me', verifyToken, authController.getCurrentUser);
router.put('/preferences', verifyToken, authController.updatePreferences);

module.exports = router;
