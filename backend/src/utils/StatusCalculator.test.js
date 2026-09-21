/**
 * Tests for StatusCalculator utility class
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
 */

const StatusCalculator = require('./StatusCalculator');

describe('StatusCalculator', () => {
  describe('calculateStatus', () => {
    test('should return "Safe" for medicine expiring in more than 30 days', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-02-15'); // 45 days
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Safe');
    });

    test('should return "Expiring Soon" for medicine expiring in 8-30 days', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-20'); // 19 days
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Expiring Soon');
    });

    test('should return "Critical" for medicine expiring in 1-7 days', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-05'); // 4 days
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Critical');
    });

    test('should return "Expired" for medicine with past expiry date', () => {
      const currentDate = new Date('2024-01-15');
      const expiryDate = new Date('2024-01-10'); // -5 days
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Expired');
    });

    test('should handle boundary at 30 days (Expiring Soon)', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-31'); // 30 days
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Expiring Soon');
    });

    test('should handle boundary at 31 days (Safe)', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-02-01'); // 31 days
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Safe');
    });

    test('should handle boundary at 8 days (Expiring Soon)', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-09'); // 8 days
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Expiring Soon');
    });

    test('should handle boundary at 7 days (Critical)', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-08'); // 7 days
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Critical');
    });

    test('should handle boundary at 1 day (Critical)', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-02'); // 1 day
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Critical');
    });

    test('should handle boundary at 0 days (Expired)', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-01'); // 0 days
      const status = StatusCalculator.calculateStatus(expiryDate, currentDate);
      expect(status).toBe('Expired');
    });
  });

  describe('getDaysUntilExpiry', () => {
    test('should calculate positive days for future expiry date', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-10');
      const days = StatusCalculator.getDaysUntilExpiry(expiryDate, currentDate);
      expect(days).toBe(9);
    });

    test('should calculate negative days for past expiry date', () => {
      const currentDate = new Date('2024-01-15');
      const expiryDate = new Date('2024-01-10');
      const days = StatusCalculator.getDaysUntilExpiry(expiryDate, currentDate);
      expect(days).toBe(-5);
    });

    test('should return 0 for same day expiry', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-01');
      const days = StatusCalculator.getDaysUntilExpiry(expiryDate, currentDate);
      expect(days).toBe(0);
    });

    test('should ignore time components when calculating days', () => {
      const currentDate = new Date('2024-01-01T14:30:00');
      const expiryDate = new Date('2024-01-10T08:15:00');
      const days = StatusCalculator.getDaysUntilExpiry(expiryDate, currentDate);
      expect(days).toBe(9);
    });

    test('should use current date if not provided', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const days = StatusCalculator.getDaysUntilExpiry(tomorrow);
      expect(days).toBe(1);
    });
  });

  describe('needsAlert', () => {
    test('should return true for medicine expiring in 30 days', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-31');
      const needsAlert = StatusCalculator.needsAlert(expiryDate, currentDate);
      expect(needsAlert).toBe(true);
    });

    test('should return true for medicine expiring in less than 30 days', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-15');
      const needsAlert = StatusCalculator.needsAlert(expiryDate, currentDate);
      expect(needsAlert).toBe(true);
    });

    test('should return false for medicine expiring in more than 30 days', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-02-15');
      const needsAlert = StatusCalculator.needsAlert(expiryDate, currentDate);
      expect(needsAlert).toBe(false);
    });

    test('should return true for expired medicine', () => {
      const currentDate = new Date('2024-01-15');
      const expiryDate = new Date('2024-01-10');
      const needsAlert = StatusCalculator.needsAlert(expiryDate, currentDate);
      expect(needsAlert).toBe(true);
    });

    test('should return true for medicine expiring today', () => {
      const currentDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-01');
      const needsAlert = StatusCalculator.needsAlert(expiryDate, currentDate);
      expect(needsAlert).toBe(true);
    });
  });

  describe('getAlertSeverity', () => {
    test('should return "critical" for 7 days or fewer', () => {
      expect(StatusCalculator.getAlertSeverity(7)).toBe('critical');
      expect(StatusCalculator.getAlertSeverity(5)).toBe('critical');
      expect(StatusCalculator.getAlertSeverity(1)).toBe('critical');
      expect(StatusCalculator.getAlertSeverity(0)).toBe('critical');
    });

    test('should return "critical" for negative days (expired)', () => {
      expect(StatusCalculator.getAlertSeverity(-1)).toBe('critical');
      expect(StatusCalculator.getAlertSeverity(-10)).toBe('critical');
    });

    test('should return "warning" for 8-30 days', () => {
      expect(StatusCalculator.getAlertSeverity(8)).toBe('warning');
      expect(StatusCalculator.getAlertSeverity(15)).toBe('warning');
      expect(StatusCalculator.getAlertSeverity(30)).toBe('warning');
    });

    test('should return "info" for more than 30 days', () => {
      expect(StatusCalculator.getAlertSeverity(31)).toBe('info');
      expect(StatusCalculator.getAlertSeverity(60)).toBe('info');
      expect(StatusCalculator.getAlertSeverity(365)).toBe('info');
    });
  });

  describe('batchCalculateStatus', () => {
    test('should calculate status for multiple medicines', () => {
      const currentDate = new Date('2024-01-01');
      const medicines = [
        { id: '1', expiryDate: new Date('2024-02-15') }, // 45 days - Safe
        { id: '2', expiryDate: new Date('2024-01-20') }, // 19 days - Expiring Soon
        { id: '3', expiryDate: new Date('2024-01-05') }, // 4 days - Critical
        { id: '4', expiryDate: new Date('2023-12-25') }, // Expired
      ];

      // Mock calculateStatus to use our test currentDate
      const originalCalculateStatus = StatusCalculator.calculateStatus;
      StatusCalculator.calculateStatus = (expiryDate, date) => 
        originalCalculateStatus(expiryDate, currentDate);

      const statusMap = StatusCalculator.batchCalculateStatus(medicines);

      // Restore original method
      StatusCalculator.calculateStatus = originalCalculateStatus;

      expect(statusMap.size).toBe(4);
      expect(statusMap.get('1')).toBe('Safe');
      expect(statusMap.get('2')).toBe('Expiring Soon');
      expect(statusMap.get('3')).toBe('Critical');
      expect(statusMap.get('4')).toBe('Expired');
    });

    test('should return empty map for empty medicines array', () => {
      const statusMap = StatusCalculator.batchCalculateStatus([]);
      expect(statusMap.size).toBe(0);
    });

    test('should handle single medicine', () => {
      const currentDate = new Date('2024-01-01');
      const medicines = [
        { id: 'test-1', expiryDate: new Date('2024-02-01') },
      ];

      const originalCalculateStatus = StatusCalculator.calculateStatus;
      StatusCalculator.calculateStatus = (expiryDate, date) => 
        originalCalculateStatus(expiryDate, currentDate);

      const statusMap = StatusCalculator.batchCalculateStatus(medicines);

      StatusCalculator.calculateStatus = originalCalculateStatus;

      expect(statusMap.size).toBe(1);
      expect(statusMap.get('test-1')).toBe('Safe');
    });
  });
});
