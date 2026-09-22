const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get unread alerts
router.get('/unread', alertController.getUnreadAlerts);

// Mark alert as read
router.put('/:id/read', alertController.markAlertAsRead);

// Acknowledge alert
router.put('/:id/acknowledge', alertController.acknowledgeAlert);

// Delete alert
router.delete('/:id', alertController.deleteAlert);

// Generate alerts (admin, pharmacist)
router.post(
  '/generate',
  requireRole('admin', 'pharmacist'),
  alertController.generateAlerts
);

module.exports = router;
