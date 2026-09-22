const alertService = require('../services/AlertService');

/**
 * Get all alerts
 */
const getAllAlerts = async (req, res, next) => {
  try {
    const { isRead, type, severity } = req.query;
    const filters = {};

    if (isRead !== undefined) filters.isRead = isRead === 'true';
    if (type) filters.type = type;
    if (severity) filters.severity = severity;

    const alerts = await alertService.getAlerts(filters);
    const stats = await alertService.getAlertStats();

    res.json({
      alerts,
      ...stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread alerts
 */
const getUnreadAlerts = async (req, res, next) => {
  try {
    const alerts = await alertService.getUnreadAlerts();
    res.json({ alerts, count: alerts.length });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark alert as read
 */
const markAlertAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await alertService.markAsRead(id, req.user.id);
    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * Acknowledge alert
 */
const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    await alertService.acknowledgeAlert(id, req.user.id);
    res.json({ message: 'Alert acknowledged' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete alert
 */
const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    await alertService.deleteAlert(id);
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate alerts for all medicines
 */
const generateAlerts = async (req, res, next) => {
  try {
    const newAlerts = await alertService.generateAlertsForAllMedicines();
    res.json({
      message: 'Alerts generated successfully',
      count: newAlerts.length,
      alerts: newAlerts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAlerts,
  getUnreadAlerts,
  markAlertAsRead,
  acknowledgeAlert,
  deleteAlert,
  generateAlerts
};
