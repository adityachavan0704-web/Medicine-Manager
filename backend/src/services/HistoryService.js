const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const HistoryLinkedList = require('../data-structures/HistoryLinkedList');

/**
 * HistoryService - Manages medicine operation history using HistoryLinkedList
 */
class HistoryService {
  constructor() {
    this.historyList = new HistoryLinkedList();
    this.initialized = false;
  }

  /**
   * Initialize the history list by loading from database
   */
  async initialize() {
    if (this.initialized) return;

    try {
      const [history] = await db.query(
        'SELECT * FROM history ORDER BY timestamp DESC LIMIT 1000'
      );

      history.forEach(entry => this.historyList.addToFront(this._formatHistoryEntry(entry)));
      this.initialized = true;
      console.log(`HistoryService initialized with ${history.length} entries`);
    } catch (error) {
      console.error('Error initializing HistoryService:', error);
      throw error;
    }
  }

  /**
   * Add a new history entry
   */
  async addHistoryEntry(entryData) {
    const entry = {
      id: uuidv4(),
      medicineId: entryData.medicineId,
      userId: entryData.userId || null,
      action: entryData.action,
      details: entryData.details,
      medicineName: entryData.medicineName,
      batchNumber: entryData.batchNumber,
      quantityBefore: entryData.quantityBefore || null,
      quantityAfter: entryData.quantityAfter || null,
      changes: entryData.changes ? JSON.stringify(entryData.changes) : null,
      timestamp: new Date()
    };

    try {
      // Insert into database
      await db.query(
        `INSERT INTO history (id, medicine_id, user_id, action, details, medicine_name,
         batch_number, quantity_before, quantity_after, changes, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.id, entry.medicineId, entry.userId, entry.action, entry.details,
          entry.medicineName, entry.batchNumber, entry.quantityBefore,
          entry.quantityAfter, entry.changes, entry.timestamp
        ]
      );

      // Add to front of linked list (most recent)
      this.historyList.addToFront(entry);

      return entry;
    } catch (error) {
      console.error('Error adding history entry:', error);
      throw error;
    }
  }

  /**
   * Get recent history entries
   */
  getRecentHistory(count = 10) {
    return this.historyList.getRecentHistory(count);
  }

  /**
   * Get history by medicine ID
   */
  async getHistoryByMedicineId(medicineId) {
    try {
      const [history] = await db.query(
        'SELECT * FROM history WHERE medicine_id = ? ORDER BY timestamp DESC',
        [medicineId]
      );

      return history.map(this._formatHistoryEntry);
    } catch (error) {
      console.error('Error getting history by medicine ID:', error);
      throw error;
    }
  }

  /**
   * Get history by action type
   */
  getHistoryByAction(action) {
    return this.historyList.getHistoryByAction(action);
  }

  /**
   * Get history in date range
   */
  async getHistoryInRange(startDate, endDate) {
    try {
      const [history] = await db.query(
        'SELECT * FROM history WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC',
        [startDate, endDate]
      );

      return history.map(this._formatHistoryEntry);
    } catch (error) {
      console.error('Error getting history in range:', error);
      throw error;
    }
  }

  /**
   * Get all history with pagination
   */
  async getAllHistory(page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
      const [history] = await db.query(
        'SELECT * FROM history ORDER BY timestamp DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );

      const [countResult] = await db.query('SELECT COUNT(*) as total FROM history');
      const total = countResult[0].total;

      return {
        history: history.map(this._formatHistoryEntry),
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting all history:', error);
      throw error;
    }
  }

  /**
   * Format history entry from database
   */
  _formatHistoryEntry(dbEntry) {
    return {
      id: dbEntry.id,
      medicineId: dbEntry.medicine_id,
      userId: dbEntry.user_id,
      action: dbEntry.action,
      details: dbEntry.details,
      medicineName: dbEntry.medicine_name,
      batchNumber: dbEntry.batch_number,
      quantityBefore: dbEntry.quantity_before,
      quantityAfter: dbEntry.quantity_after,
      changes: dbEntry.changes ? JSON.parse(dbEntry.changes) : null,
      timestamp: dbEntry.timestamp
    };
  }
}

module.exports = new HistoryService();
