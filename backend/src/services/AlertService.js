const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const AlertQueue = require('../data-structures/AlertQueue');
const StatusCalculator = require('../utils/StatusCalculator');

/**
 * AlertService - Manages medicine alerts using AlertQueue data structure
 */
class AlertService {
  constructor() {
    this.alertQueue = new AlertQueue(1000); // Max 1000 alerts in queue
    this.initialized = false;
  }

  /**
   * Initialize the alert queue by loading existing alerts from database
   */
  async initialize() {
    if (this.initialized) return;

    try {
      const [alerts] = await db.query(
        'SELECT * FROM alerts ORDER BY created_at DESC LIMIT 1000'
      );

      alerts.forEach(alert => this.alertQueue.enqueue(this._formatAlert(alert)));
      this.initialized = true;
      console.log(`AlertService initialized with ${alerts.length} alerts`);
    } catch (error) {
      console.error('Error initializing AlertService:', error);
      throw error;
    }
  }

  /**
   * Add a new alert to queue and database
   */
  async addAlert(alertData) {
    const alert = {
      id: uuidv4(),
      medicineId: alertData.medicineId,
      type: alertData.type,
      severity: alertData.severity,
      message: alertData.message,
      medicineName: alertData.medicineName,
      batchNumber: alertData.batchNumber,
      expiryDate: alertData.expiryDate,
      daysUntilExpiry: alertData.daysUntilExpiry,
      isRead: false,
      isAcknowledged: false,
      createdAt: new Date()
    };

    try {
      // Insert into database
      await db.query(
        `INSERT INTO alerts (id, medicine_id, type, severity, message, medicine_name, 
         batch_number, expiry_date, days_until_expiry, is_read, is_acknowledged, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          alert.id, alert.medicineId, alert.type, alert.severity, alert.message,
          alert.medicineName, alert.batchNumber, alert.expiryDate, alert.daysUntilExpiry,
          alert.isRead, alert.isAcknowledged, alert.createdAt
        ]
      );

      // Add to queue (remove oldest if full)
      if (this.alertQueue.isFull()) {
        this.alertQueue.dequeue();
      }
      this.alertQueue.enqueue(alert);

      return alert;
    } catch (error) {
      console.error('Error adding alert:', error);
      throw error;
    }
  }

  /**
   * Get all alerts with optional filtering
   */
  async getAlerts(filters = {}) {
    try {
      let query = 'SELECT * FROM alerts WHERE 1=1';
      const params = [];

      if (filters.isRead !== undefined) {
        query += ' AND is_read = ?';
        params.push(filters.isRead);
      }

      if (filters.type) {
        query += ' AND type = ?';
        params.push(filters.type);
      }

      if (filters.severity) {
        query += ' AND severity = ?';
        params.push(filters.severity);
      }

      query += ' ORDER BY created_at DESC LIMIT 100';

      const [alerts] = await db.query(query, params);
      return alerts.map(this._formatAlert);
    } catch (error) {
      console.error('Error getting alerts:', error);
      throw error;
    }
  }

  /**
   * Get unread alerts
   */
  async getUnreadAlerts() {
    return this.alertQueue.getUnreadAlerts();
  }

  /**
   * Get alerts by type
   */
  getAlertsByType(type) {
    return this.alertQueue.getAlertsByType(type);
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity) {
    return this.alertQueue.getAlertsBySeverity(severity);
  }

  /**
   * Mark alert as read
   */
  async markAsRead(alertId, userId) {
    try {
      await db.query(
        'UPDATE alerts SET is_read = TRUE WHERE id = ?',
        [alertId]
      );

      this.alertQueue.markAsRead(alertId);
      return true;
    } catch (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }
  }

  /**
   * Acknowledge alert
   */
  async acknowledgeAlert(alertId, userId) {
    try {
      await db.query(
        'UPDATE alerts SET is_acknowledged = TRUE, acknowledged_by = ?, acknowledged_at = NOW() WHERE id = ?',
        [userId, alertId]
      );

      return true;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  /**
   * Delete alert
   */
  async deleteAlert(alertId) {
    try {
      await db.query('DELETE FROM alerts WHERE id = ?', [alertId]);
      return true;
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  /**
   * Generate alerts for all medicines
   */
  async generateAlertsForAllMedicines() {
    try {
      const [medicines] = await db.query('SELECT * FROM medicines');
      const newAlerts = [];

      for (const medicine of medicines) {
        const alerts = this.alertQueue.generateAlertsForMedicine(medicine);
        
        for (const alertData of alerts) {
          // Check if alert already exists
          const [existing] = await db.query(
            'SELECT id FROM alerts WHERE medicine_id = ? AND type = ? AND is_read = FALSE',
            [medicine.id, alertData.type]
          );

          if (existing.length === 0) {
            const alert = await this.addAlert(alertData);
            newAlerts.push(alert);
          }
        }
      }

      return newAlerts;
    } catch (error) {
      console.error('Error generating alerts:', error);
      throw error;
    }
  }

  /**
   * Get alert statistics
   */
  async getAlertStats() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread,
          SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) as critical,
          SUM(CASE WHEN severity = 'warning' THEN 1 ELSE 0 END) as warning,
          SUM(CASE WHEN severity = 'info' THEN 1 ELSE 0 END) as info
        FROM alerts
      `);

      return stats[0];
    } catch (error) {
      console.error('Error getting alert stats:', error);
      throw error;
    }
  }

  /**
   * Format alert from database
   */
  _formatAlert(dbAlert) {
    return {
      id: dbAlert.id,
      medicineId: dbAlert.medicine_id,
      type: dbAlert.type,
      severity: dbAlert.severity,
      message: dbAlert.message,
      medicineName: dbAlert.medicine_name,
      batchNumber: dbAlert.batch_number,
      expiryDate: dbAlert.expiry_date,
      daysUntilExpiry: dbAlert.days_until_expiry,
      isRead: dbAlert.is_read,
      isAcknowledged: dbAlert.is_acknowledged,
      acknowledgedBy: dbAlert.acknowledged_by,
      acknowledgedAt: dbAlert.acknowledged_at,
      createdAt: dbAlert.created_at
    };
  }
}

module.exports = new AlertService();
