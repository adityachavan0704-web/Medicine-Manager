/**
 * StatusCalculator - Utility class for calculating medicine status based on expiry dates
 * 
 * Implements auto-calculation logic for 4-tier medicine status system:
 * - Safe: > 30 days until expiry
 * - Expiring Soon: 8-30 days until expiry
 * - Critical: 1-7 days until expiry
 * - Expired: Already expired (< 0 days)
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
 */

class StatusCalculator {
  /**
   * Calculate medicine status based on expiry date
   * 
   * Preconditions: 
   * - expiryDate is a valid Date object
   * - currentDate is a valid Date object (optional, defaults to now)
   * 
   * Postconditions:
   * - Returns one of: 'Safe', 'Expiring Soon', 'Critical', 'Expired'
   * - Status is determined by days until expiry
   * 
   * Time Complexity: O(1)
   * 
   * @param {Date} expiryDate - The medicine expiry date
   * @param {Date} [currentDate=new Date()] - The current date for comparison
   * @returns {'Safe' | 'Expiring Soon' | 'Critical' | 'Expired'} The calculated status
   * 
   * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
   */
  static calculateStatus(expiryDate, currentDate = new Date()) {
    const daysUntilExpiry = this.getDaysUntilExpiry(expiryDate, currentDate);
    
    // Requirement 2.4: Expired if expiry date is in the past
    if (daysUntilExpiry < 0) {
      return 'Expired';
    }
    
    // Requirement 2.3: Critical if 1-7 days until expiry
    if (daysUntilExpiry >= 1 && daysUntilExpiry <= 7) {
      return 'Critical';
    }
    
    // Requirement 2.2: Expiring Soon if 8-30 days until expiry
    if (daysUntilExpiry >= 8 && daysUntilExpiry <= 30) {
      return 'Expiring Soon';
    }
    
    // Requirement 2.1: Safe if more than 30 days until expiry
    return 'Safe';
  }
  
  /**
   * Get days until expiry
   * 
   * Calculates the integer number of days between current date and expiry date.
   * Negative values indicate the medicine has expired.
   * 
   * Preconditions:
   * - expiryDate is a valid Date object
   * - currentDate is a valid Date object (optional, defaults to now)
   * 
   * Postconditions:
   * - Returns integer representing days until expiry
   * - Positive: days remaining, Negative: days expired, Zero: expires today
   * 
   * Time Complexity: O(1)
   * 
   * @param {Date} expiryDate - The medicine expiry date
   * @param {Date} [currentDate=new Date()] - The current date for comparison
   * @returns {number} Integer days until expiry (negative if expired)
   * 
   * **Validates: Requirement 2.5**
   */
  static getDaysUntilExpiry(expiryDate, currentDate = new Date()) {
    // Reset time components to calculate full days only
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    const current = new Date(currentDate);
    current.setHours(0, 0, 0, 0);
    
    // Calculate difference in milliseconds, then convert to days
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = expiry.getTime() - current.getTime();
    const diffDays = Math.floor(diffMs / msPerDay);
    
    return diffDays;
  }
  
  /**
   * Check if medicine needs an alert
   * 
   * Determines if a medicine requires an alert based on its expiry date.
   * Alert threshold is set at 30 days or fewer until expiry.
   * 
   * Preconditions:
   * - expiryDate is a valid Date object
   * - currentDate is a valid Date object (optional, defaults to now)
   * 
   * Postconditions:
   * - Returns true if days until expiry <= 30
   * - Returns false if days until expiry > 30
   * 
   * Time Complexity: O(1)
   * 
   * @param {Date} expiryDate - The medicine expiry date
   * @param {Date} [currentDate=new Date()] - The current date for comparison
   * @returns {boolean} True if alert needed (≤30 days), false otherwise
   * 
   * **Validates: Requirement 2.6**
   */
  static needsAlert(expiryDate, currentDate = new Date()) {
    const daysUntilExpiry = this.getDaysUntilExpiry(expiryDate, currentDate);
    return daysUntilExpiry <= 30;
  }
  
  /**
   * Get alert severity based on days until expiry
   * 
   * Maps days until expiry to alert severity levels:
   * - critical: 7 days or fewer (includes expired medicines)
   * - warning: 8-30 days
   * - info: more than 30 days
   * 
   * Preconditions:
   * - daysUntilExpiry is a number (can be negative for expired medicines)
   * 
   * Postconditions:
   * - Returns 'critical', 'warning', or 'info'
   * - Severity matches alert tier system
   * 
   * Time Complexity: O(1)
   * 
   * @param {number} daysUntilExpiry - Days until medicine expires
   * @returns {'info' | 'warning' | 'critical'} Alert severity level
   */
  static getAlertSeverity(daysUntilExpiry) {
    // Critical: 7 days or fewer (including expired)
    if (daysUntilExpiry <= 7) {
      return 'critical';
    }
    
    // Warning: 8-30 days
    if (daysUntilExpiry >= 8 && daysUntilExpiry <= 30) {
      return 'warning';
    }
    
    // Info: more than 30 days
    return 'info';
  }
  
  /**
   * Batch calculate status for multiple medicines
   * 
   * Efficiently calculates status for an array of medicines and returns
   * a Map with medicine IDs as keys and status as values.
   * 
   * Preconditions:
   * - medicines is an array of objects with 'id' and 'expiryDate' properties
   * - Each medicine.expiryDate is a valid Date object
   * 
   * Postconditions:
   * - Returns Map<string, status> with entry for each medicine
   * - Each status is correctly calculated based on expiry date
   * 
   * Time Complexity: O(n) where n is the number of medicines
   * 
   * @param {Array<{id: string, expiryDate: Date}>} medicines - Array of medicines
   * @returns {Map<string, string>} Map of medicine ID to status
   * 
   * **Validates: Requirement 2.7**
   */
  static batchCalculateStatus(medicines) {
    const statusMap = new Map();
    const currentDate = new Date();
    
    // Calculate status for each medicine in O(n) time
    for (const medicine of medicines) {
      const status = this.calculateStatus(medicine.expiryDate, currentDate);
      statusMap.set(medicine.id, status);
    }
    
    return statusMap;
  }
}

module.exports = StatusCalculator;
