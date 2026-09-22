const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Get dashboard analytics
router.get('/dashboard', analyticsController.getDashboardAnalytics);

// Get trend analytics
router.get('/trends', analyticsController.getTrendAnalytics);

module.exports = router;
