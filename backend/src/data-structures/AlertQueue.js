/**
 * AlertQueue Data Structure for FIFO Alert Management
 * Custom queue implementation using circular array for efficient space utilization
 * Manages medicine alerts with multi-tier severity levels (30-day, 7-day, 1-day warnings)
 * Used for maintaining alert order and generating expiry/stock notifications
 * 
 * Implements Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13
 */
class AlertQueue {
  /**
   * Initialize AlertQueue with circular array implementation
   * Preconditions: maxSize > 0
   * Postconditions: empty queue with specified capacity
   * Time Complexity: O(1)
   * Space Complexity: O(maxSize)
   * @param {number} maxSize - Maximum queue capacity (default: 1000)
   */
  constructor(maxSize = 1000) {
    this.queue = new Array(maxSize);
    this.front = 0;
    this.rear = -1;
    this.maxSize = maxSize;
    this._size = 0;
  }

  /**
   * Add alert to rear of queue (FIFO enqueue operation)
   * Preconditions: alert is valid IAlert object
   * Postconditions: if not full, alert added at rear, size incremented
   * Time Complexity: O(1)
   * Implements Requirements: 5.1, 5.4
   * @param {Object} alert - Alert object with id, medicineId, type, severity, message, etc.
   * @returns {boolean} True if enqueued successfully, false if queue is full
   */
  enqueue(alert) {
    if (this.isFull()) {
      return false;
    }
    
    // Circular array wrapping: rear moves to next position with modulo
    this.rear = (this.rear + 1) % this.maxSize;
    this.queue[this.rear] = alert;
    this._size++;
    
    return true;
  }

  /**
   * Remove and return alert from front of queue (FIFO dequeue operation)
   * Preconditions: none
   * Postconditions: if not empty, front alert removed, front pointer advanced, size decremented
   * Time Complexity: O(1)
   * Implements Requirements: 5.2
   * Loop Invariant: FIFO order maintained - oldest unprocessed alert always at front
   * @returns {Object|null} Alert from front or null if empty
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    
    const alert = this.queue[this.front];
    this.queue[this.front] = null; // Clear reference for garbage collection
    this.front = (this.front + 1) % this.maxSize; // Circular array wrapping
    this._size--;
    
    return alert;
  }

  /**
   * View alert at front without removing (peek operation)
   * Preconditions: none
   * Postconditions: returns front alert or null, queue unchanged
   * Time Complexity: O(1)
   * Implements Requirements: 5.3
   * @returns {Object|null} Alert at front or null if empty
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    
    return this.queue[this.front];
  }

  /**
   * Get all unread alerts from queue
   * Preconditions: none
   * Postconditions: returns array of unread alerts, queue unchanged
   * Time Complexity: O(n) where n is queue size
   * Implements Requirements: 5.12
   * Loop Invariant: index traverses circular array from front to rear, collecting unread alerts
   * @returns {Array} Array of unread alerts
   */
  getUnreadAlerts() {
    if (this.isEmpty()) {
      return [];
    }
    
    const alerts = [];
    let index = this.front;
    let count = 0;
    
    // Traverse circular array from front to rear
    while (count < this._size) {
      const alert = this.queue[index];
      if (alert && !alert.isRead) {
        alerts.push(alert);
      }
      index = (index + 1) % this.maxSize;
      count++;
    }
    
    return alerts;
  }

  /**
   * Get alerts by specific type
   * Preconditions: none
   * Postconditions: returns array of matching alerts, queue unchanged
   * Time Complexity: O(n) where n is queue size
   * Implements Requirements: 5.10
   * Loop Invariant: index traverses circular array, collecting alerts matching specified type
   * @param {string} type - Alert type (EXPIRING_30, EXPIRING_7, EXPIRING_1, EXPIRED, LOW_STOCK)
   * @returns {Array} Array of alerts matching type
   */
  getAlertsByType(type) {
    if (this.isEmpty()) {
      return [];
    }
    
    const alerts = [];
    let index = this.front;
    let count = 0;
    
    while (count < this._size) {
      const alert = this.queue[index];
      if (alert && alert.type === type) {
        alerts.push(alert);
      }
      index = (index + 1) % this.maxSize;
      count++;
    }
    
    return alerts;
  }

  /**
   * Get alerts by severity level
   * Preconditions: none
   * Postconditions: returns array of matching alerts, queue unchanged
   * Time Complexity: O(n) where n is queue size
   * Implements Requirements: 5.11
   * Loop Invariant: index traverses circular array, collecting alerts matching specified severity
   * @param {string} severity - Severity level (info, warning, critical)
   * @returns {Array} Array of alerts matching severity
   */
  getAlertsBySeverity(severity) {
    if (this.isEmpty()) {
      return [];
    }
    
    const alerts = [];
    let index = this.front;
    let count = 0;
    
    while (count < this._size) {
      const alert = this.queue[index];
      if (alert && alert.severity === severity) {
        alerts.push(alert);
      }
      index = (index + 1) % this.maxSize;
      count++;
    }
    
    return alerts;
  }

  /**
   * Mark alert as read by ID
   * Preconditions: none
   * Postconditions: if found, alert.isRead set to true and returns true
   * Time Complexity: O(n) where n is queue size
   * Implements Requirements: 5.13
   * Loop Invariant: index traverses circular array searching for matching alert ID
   * @param {string} alertId - Alert ID to mark as read
   * @returns {boolean} True if found and marked, false otherwise
   */
  markAsRead(alertId) {
    if (this.isEmpty()) {
      return false;
    }
    
    let index = this.front;
    let count = 0;
    
    while (count < this._size) {
      const alert = this.queue[index];
      if (alert && alert.id === alertId) {
        alert.isRead = true;
        return true;
      }
      index = (index + 1) % this.maxSize;
      count++;
    }
    
    return false;
  }

  /**
   * Generate alerts for a medicine based on expiry date and stock levels
   * Multi-tier alert logic:
   * - Expired (< 0 days): EXPIRED alert with critical severity
   * - 0-1 days: EXPIRING_1 alert with critical severity
   * - 2-7 days: EXPIRING_7 alert with warning severity
   * - 8-30 days: EXPIRING_30 alert with info severity
   * - Quantity <= threshold: LOW_STOCK alert with warning severity
   * 
   * Preconditions: medicine is valid IMedicine object with expiryDate, quantity, lowStockThreshold
   * Postconditions: returns array of 0-2 alerts (1 expiry alert + optional low stock alert)
   * Time Complexity: O(1) - fixed number of date comparisons
   * Implements Requirements: 5.5, 5.6, 5.7, 5.8, 5.9
   * 
   * @param {Object} medicine - Medicine object with expiryDate, quantity, lowStockThreshold
   * @returns {Array} Array of generated alerts (0-2 alerts)
   */
  generateAlertsForMedicine(medicine) {
    const alerts = [];
    const now = new Date();
    const expiryDate = new Date(medicine.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    // Generate unique alert ID with type and timestamp
    const generateAlertId = (type) => {
      return `${medicine.id}-${type}-${Date.now()}`;
    };
    
    // Check for expired medicine (Requirement 5.5)
    if (daysUntilExpiry < 0) {
      alerts.push({
        id: generateAlertId('EXPIRED'),
        medicineId: medicine.id,
        medicineName: medicine.name,
        batchNumber: medicine.batchNumber,
        type: 'EXPIRED',
        severity: 'critical',
        message: `${medicine.name} (Batch: ${medicine.batchNumber}) has EXPIRED on ${expiryDate.toLocaleDateString()}`,
        expiryDate: medicine.expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        createdAt: new Date(),
        isRead: false,
        isAcknowledged: false
      });
    }
    // Check for 1-day expiry warning (critical) (Requirement 5.6)
    else if (daysUntilExpiry >= 0 && daysUntilExpiry <= 1) {
      alerts.push({
        id: generateAlertId('EXPIRING_1'),
        medicineId: medicine.id,
        medicineName: medicine.name,
        batchNumber: medicine.batchNumber,
        type: 'EXPIRING_1',
        severity: 'critical',
        message: `URGENT: ${medicine.name} (Batch: ${medicine.batchNumber}) expires in ${daysUntilExpiry} day(s)`,
        expiryDate: medicine.expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        createdAt: new Date(),
        isRead: false,
        isAcknowledged: false
      });
    }
    // Check for 2-7 day expiry warning (Requirement 5.7)
    else if (daysUntilExpiry >= 2 && daysUntilExpiry <= 7) {
      alerts.push({
        id: generateAlertId('EXPIRING_7'),
        medicineId: medicine.id,
        medicineName: medicine.name,
        batchNumber: medicine.batchNumber,
        type: 'EXPIRING_7',
        severity: 'warning',
        message: `${medicine.name} (Batch: ${medicine.batchNumber}) expires in ${daysUntilExpiry} days`,
        expiryDate: medicine.expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        createdAt: new Date(),
        isRead: false,
        isAcknowledged: false
      });
    }
    // Check for 8-30 day expiry warning (Requirement 5.8)
    else if (daysUntilExpiry >= 8 && daysUntilExpiry <= 30) {
      alerts.push({
        id: generateAlertId('EXPIRING_30'),
        medicineId: medicine.id,
        medicineName: medicine.name,
        batchNumber: medicine.batchNumber,
        type: 'EXPIRING_30',
        severity: 'info',
        message: `${medicine.name} (Batch: ${medicine.batchNumber}) expires in ${daysUntilExpiry} days`,
        expiryDate: medicine.expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        createdAt: new Date(),
        isRead: false,
        isAcknowledged: false
      });
    }
    
    // Check for low stock alert (Requirement 5.9)
    if (medicine.quantity <= medicine.lowStockThreshold) {
      alerts.push({
        id: generateAlertId('LOW_STOCK'),
        medicineId: medicine.id,
        medicineName: medicine.name,
        batchNumber: medicine.batchNumber,
        type: 'LOW_STOCK',
        severity: 'warning',
        message: `Low stock: ${medicine.name} (Batch: ${medicine.batchNumber}) has only ${medicine.quantity} ${medicine.unit} remaining`,
        expiryDate: medicine.expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        createdAt: new Date(),
        isRead: false,
        isAcknowledged: false
      });
    }
    
    return alerts;
  }

  /**
   * Check if queue is empty
   * Preconditions: none
   * Postconditions: returns boolean, queue unchanged
   * Time Complexity: O(1)
   * @returns {boolean} True if empty, false otherwise
   */
  isEmpty() {
    return this._size === 0;
  }

  /**
   * Check if queue is full
   * Preconditions: none
   * Postconditions: returns boolean, queue unchanged
   * Time Complexity: O(1)
   * Implements Requirements: 5.4
   * @returns {boolean} True if full, false otherwise
   */
  isFull() {
    return this._size === this.maxSize;
  }

  /**
   * Get current queue size
   * Preconditions: none
   * Postconditions: returns integer size, queue unchanged
   * Time Complexity: O(1)
   * @returns {number} Current number of alerts in queue
   */
  size() {
    return this._size;
  }

  /**
   * Clear all alerts from queue
   * Preconditions: none
   * Postconditions: queue emptied, size reset to 0, pointers reset
   * Time Complexity: O(1)
   * @returns {void}
   */
  clear() {
    this.queue = new Array(this.maxSize);
    this.front = 0;
    this.rear = -1;
    this._size = 0;
  }

  /**
   * Get all alerts as array (for debugging/visualization)
   * Preconditions: none
   * Postconditions: returns array of all alerts in FIFO order, queue unchanged
   * Time Complexity: O(n) where n is queue size
   * Loop Invariant: index traverses circular array from front to rear, collecting all alerts
   * Used for data structure visualization page (Requirement 12.5, 12.6)
   * @returns {Array} Array of all alerts in queue
   */
  toArray() {
    if (this.isEmpty()) {
      return [];
    }
    
    const alerts = [];
    let index = this.front;
    let count = 0;
    
    // Traverse circular array maintaining FIFO order
    while (count < this._size) {
      if (this.queue[index]) {
        alerts.push(this.queue[index]);
      }
      index = (index + 1) % this.maxSize;
      count++;
    }
    
    return alerts;
  }

  /**
   * Get queue structure for visualization
   * Returns internal queue state including front/rear pointers
   * Preconditions: none
   * Postconditions: returns visualization object, queue unchanged
   * Time Complexity: O(n)
   * Used for data structure visualization page (Requirement 12.5, 12.6)
   * @returns {Object} Queue structure with items, front, rear, size, capacity
   */
  getQueueStructure() {
    return {
      items: this.toArray(),
      front: this.front,
      rear: this.rear,
      size: this._size,
      maxSize: this.maxSize,
      isEmpty: this.isEmpty(),
      isFull: this.isFull(),
      loadFactor: this._size / this.maxSize
    };
  }
}

export default AlertQueue;
