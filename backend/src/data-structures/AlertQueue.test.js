/**
 * Unit Tests for AlertQueue Data Structure
 * Tests FIFO behavior, alert generation, filtering, and circular array wrapping
 * 
 * Validates Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13
 */

import AlertQueue from './AlertQueue.js';

describe('AlertQueue Data Structure', () => {
  let queue;

  beforeEach(() => {
    queue = new AlertQueue(5); // Small size for testing
  });

  describe('Constructor and Basic Operations', () => {
    test('should initialize empty queue with correct properties', () => {
      expect(queue.isEmpty()).toBe(true);
      expect(queue.isFull()).toBe(false);
      expect(queue.size()).toBe(0);
    });

    test('should enqueue alerts successfully (Requirement 5.1)', () => {
      const alert1 = { id: '1', type: 'EXPIRING_7', severity: 'warning', isRead: false };
      const result = queue.enqueue(alert1);
      
      expect(result).toBe(true);
      expect(queue.size()).toBe(1);
      expect(queue.isEmpty()).toBe(false);
    });

    test('should dequeue alerts in FIFO order (Requirement 5.2)', () => {
      const alert1 = { id: '1', type: 'EXPIRING_7', severity: 'warning', isRead: false };
      const alert2 = { id: '2', type: 'EXPIRING_1', severity: 'critical', isRead: false };
      const alert3 = { id: '3', type: 'LOW_STOCK', severity: 'warning', isRead: false };
      
      queue.enqueue(alert1);
      queue.enqueue(alert2);
      queue.enqueue(alert3);
      
      expect(queue.dequeue()).toEqual(alert1);
      expect(queue.dequeue()).toEqual(alert2);
      expect(queue.dequeue()).toEqual(alert3);
      expect(queue.isEmpty()).toBe(true);
    });

    test('should peek at front alert without removing (Requirement 5.3)', () => {
      const alert1 = { id: '1', type: 'EXPIRING_7', severity: 'warning', isRead: false };
      queue.enqueue(alert1);
      
      expect(queue.peek()).toEqual(alert1);
      expect(queue.size()).toBe(1); // Size unchanged
      expect(queue.peek()).toEqual(alert1); // Still there
    });

    test('should return null when peeking empty queue', () => {
      expect(queue.peek()).toBeNull();
    });

    test('should return null when dequeueing empty queue', () => {
      expect(queue.dequeue()).toBeNull();
    });
  });

  describe('Queue Full Condition (Requirement 5.4)', () => {
    test('should reject enqueue when queue is full', () => {
      // Fill queue to capacity (5)
      for (let i = 0; i < 5; i++) {
        const alert = { id: `${i}`, type: 'EXPIRING_7', severity: 'warning', isRead: false };
        expect(queue.enqueue(alert)).toBe(true);
      }
      
      expect(queue.isFull()).toBe(true);
      
      // Attempt to add one more
      const extraAlert = { id: '6', type: 'EXPIRED', severity: 'critical', isRead: false };
      expect(queue.enqueue(extraAlert)).toBe(false);
      expect(queue.size()).toBe(5);
    });
  });

  describe('Circular Array Wrapping', () => {
    test('should handle circular array wrapping correctly', () => {
      // Fill queue
      for (let i = 0; i < 5; i++) {
        queue.enqueue({ id: `${i}`, type: 'EXPIRING_7', severity: 'warning', isRead: false });
      }
      
      // Dequeue 3 items
      queue.dequeue();
      queue.dequeue();
      queue.dequeue();
      
      // Add 3 more items (should wrap around)
      queue.enqueue({ id: '5', type: 'EXPIRING_1', severity: 'critical', isRead: false });
      queue.enqueue({ id: '6', type: 'EXPIRED', severity: 'critical', isRead: false });
      queue.enqueue({ id: '7', type: 'LOW_STOCK', severity: 'warning', isRead: false });
      
      expect(queue.size()).toBe(5);
      expect(queue.isFull()).toBe(true);
      
      // Verify FIFO order maintained
      expect(queue.dequeue().id).toBe('3');
      expect(queue.dequeue().id).toBe('4');
      expect(queue.dequeue().id).toBe('5');
      expect(queue.dequeue().id).toBe('6');
      expect(queue.dequeue().id).toBe('7');
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('Alert Generation for Medicine', () => {
    test('should generate EXPIRED alert for past expiry date (Requirement 5.5)', () => {
      const medicine = {
        id: 'med1',
        name: 'Aspirin',
        batchNumber: 'B001',
        expiryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        quantity: 100,
        lowStockThreshold: 10,
        unit: 'tablets'
      };
      
      const alerts = queue.generateAlertsForMedicine(medicine);
      
      expect(alerts.length).toBeGreaterThanOrEqual(1);
      const expiredAlert = alerts.find(a => a.type === 'EXPIRED');
      expect(expiredAlert).toBeDefined();
      expect(expiredAlert.severity).toBe('critical');
      expect(expiredAlert.daysUntilExpiry).toBeLessThan(0);
    });

    test('should generate EXPIRING_1 alert for 0-1 day expiry (Requirement 5.6)', () => {
      const medicine = {
        id: 'med2',
        name: 'Ibuprofen',
        batchNumber: 'B002',
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        quantity: 50,
        lowStockThreshold: 10,
        unit: 'tablets'
      };
      
      const alerts = queue.generateAlertsForMedicine(medicine);
      
      const expiring1Alert = alerts.find(a => a.type === 'EXPIRING_1');
      expect(expiring1Alert).toBeDefined();
      expect(expiring1Alert.severity).toBe('critical');
      expect(expiring1Alert.message).toContain('URGENT');
    });

    test('should generate EXPIRING_7 alert for 2-7 day expiry (Requirement 5.7)', () => {
      const medicine = {
        id: 'med3',
        name: 'Paracetamol',
        batchNumber: 'B003',
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        quantity: 200,
        lowStockThreshold: 10,
        unit: 'tablets'
      };
      
      const alerts = queue.generateAlertsForMedicine(medicine);
      
      const expiring7Alert = alerts.find(a => a.type === 'EXPIRING_7');
      expect(expiring7Alert).toBeDefined();
      expect(expiring7Alert.severity).toBe('warning');
      expect(expiring7Alert.daysUntilExpiry).toBeGreaterThanOrEqual(2);
      expect(expiring7Alert.daysUntilExpiry).toBeLessThanOrEqual(7);
    });

    test('should generate EXPIRING_30 alert for 8-30 day expiry (Requirement 5.8)', () => {
      const medicine = {
        id: 'med4',
        name: 'Amoxicillin',
        batchNumber: 'B004',
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        quantity: 100,
        lowStockThreshold: 10,
        unit: 'capsules'
      };
      
      const alerts = queue.generateAlertsForMedicine(medicine);
      
      const expiring30Alert = alerts.find(a => a.type === 'EXPIRING_30');
      expect(expiring30Alert).toBeDefined();
      expect(expiring30Alert.severity).toBe('info');
      expect(expiring30Alert.daysUntilExpiry).toBeGreaterThanOrEqual(8);
      expect(expiring30Alert.daysUntilExpiry).toBeLessThanOrEqual(30);
    });

    test('should generate LOW_STOCK alert when quantity <= threshold (Requirement 5.9)', () => {
      const medicine = {
        id: 'med5',
        name: 'Vitamin C',
        batchNumber: 'B005',
        expiryDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000), // 100 days from now
        quantity: 5, // Below threshold
        lowStockThreshold: 10,
        unit: 'tablets'
      };
      
      const alerts = queue.generateAlertsForMedicine(medicine);
      
      const lowStockAlert = alerts.find(a => a.type === 'LOW_STOCK');
      expect(lowStockAlert).toBeDefined();
      expect(lowStockAlert.severity).toBe('warning');
      expect(lowStockAlert.message).toContain('Low stock');
    });

    test('should generate both expiry and low stock alerts when applicable', () => {
      const medicine = {
        id: 'med6',
        name: 'Antibiotic',
        batchNumber: 'B006',
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        quantity: 5, // Below threshold
        lowStockThreshold: 10,
        unit: 'tablets'
      };
      
      const alerts = queue.generateAlertsForMedicine(medicine);
      
      expect(alerts.length).toBe(2);
      expect(alerts.find(a => a.type === 'EXPIRING_7')).toBeDefined();
      expect(alerts.find(a => a.type === 'LOW_STOCK')).toBeDefined();
    });

    test('should not generate alerts for safe medicines', () => {
      const medicine = {
        id: 'med7',
        name: 'Safe Medicine',
        batchNumber: 'B007',
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        quantity: 100,
        lowStockThreshold: 10,
        unit: 'tablets'
      };
      
      const alerts = queue.generateAlertsForMedicine(medicine);
      
      expect(alerts.length).toBe(0);
    });
  });

  describe('Alert Filtering', () => {
    beforeEach(() => {
      queue = new AlertQueue(10); // Larger queue for filtering tests
      
      // Add various alerts
      queue.enqueue({ id: '1', type: 'EXPIRING_30', severity: 'info', isRead: false });
      queue.enqueue({ id: '2', type: 'EXPIRING_7', severity: 'warning', isRead: false });
      queue.enqueue({ id: '3', type: 'EXPIRING_1', severity: 'critical', isRead: true });
      queue.enqueue({ id: '4', type: 'EXPIRED', severity: 'critical', isRead: false });
      queue.enqueue({ id: '5', type: 'LOW_STOCK', severity: 'warning', isRead: true });
    });

    test('should filter alerts by type (Requirement 5.10)', () => {
      const expiring7Alerts = queue.getAlertsByType('EXPIRING_7');
      expect(expiring7Alerts.length).toBe(1);
      expect(expiring7Alerts[0].id).toBe('2');

      const criticalAlerts = queue.getAlertsByType('EXPIRED');
      expect(criticalAlerts.length).toBe(1);
      expect(criticalAlerts[0].id).toBe('4');
    });

    test('should filter alerts by severity (Requirement 5.11)', () => {
      const criticalAlerts = queue.getAlertsBySeverity('critical');
      expect(criticalAlerts.length).toBe(2);
      expect(criticalAlerts.map(a => a.id).sort()).toEqual(['3', '4']);

      const warningAlerts = queue.getAlertsBySeverity('warning');
      expect(warningAlerts.length).toBe(2);
      expect(warningAlerts.map(a => a.id).sort()).toEqual(['2', '5']);

      const infoAlerts = queue.getAlertsBySeverity('info');
      expect(infoAlerts.length).toBe(1);
      expect(infoAlerts[0].id).toBe('1');
    });

    test('should get only unread alerts (Requirement 5.12)', () => {
      const unreadAlerts = queue.getUnreadAlerts();
      expect(unreadAlerts.length).toBe(3);
      expect(unreadAlerts.map(a => a.id).sort()).toEqual(['1', '2', '4']);
      unreadAlerts.forEach(alert => {
        expect(alert.isRead).toBe(false);
      });
    });

    test('should mark alert as read by ID (Requirement 5.13)', () => {
      const result = queue.markAsRead('2');
      expect(result).toBe(true);

      const unreadAlerts = queue.getUnreadAlerts();
      expect(unreadAlerts.length).toBe(2);
      expect(unreadAlerts.find(a => a.id === '2')).toBeUndefined();
    });

    test('should return false when marking non-existent alert as read', () => {
      const result = queue.markAsRead('999');
      expect(result).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    test('should clear all alerts', () => {
      queue.enqueue({ id: '1', type: 'EXPIRING_7', severity: 'warning', isRead: false });
      queue.enqueue({ id: '2', type: 'EXPIRING_1', severity: 'critical', isRead: false });
      
      expect(queue.size()).toBe(2);
      
      queue.clear();
      
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    test('should convert queue to array maintaining FIFO order', () => {
      const alert1 = { id: '1', type: 'EXPIRING_7', severity: 'warning', isRead: false };
      const alert2 = { id: '2', type: 'EXPIRING_1', severity: 'critical', isRead: false };
      const alert3 = { id: '3', type: 'EXPIRED', severity: 'critical', isRead: false };
      
      queue.enqueue(alert1);
      queue.enqueue(alert2);
      queue.enqueue(alert3);
      
      const array = queue.toArray();
      
      expect(array.length).toBe(3);
      expect(array[0]).toEqual(alert1);
      expect(array[1]).toEqual(alert2);
      expect(array[2]).toEqual(alert3);
    });

    test('should return empty array for empty queue', () => {
      expect(queue.toArray()).toEqual([]);
      expect(queue.getUnreadAlerts()).toEqual([]);
      expect(queue.getAlertsByType('EXPIRED')).toEqual([]);
      expect(queue.getAlertsBySeverity('critical')).toEqual([]);
    });

    test('should get queue structure for visualization', () => {
      queue.enqueue({ id: '1', type: 'EXPIRING_7', severity: 'warning', isRead: false });
      queue.enqueue({ id: '2', type: 'EXPIRING_1', severity: 'critical', isRead: false });
      
      const structure = queue.getQueueStructure();
      
      expect(structure.size).toBe(2);
      expect(structure.maxSize).toBe(5);
      expect(structure.isEmpty).toBe(false);
      expect(structure.isFull).toBe(false);
      expect(structure.items.length).toBe(2);
      expect(structure.loadFactor).toBe(0.4);
    });
  });
});
