/**
 * Unit Tests for HistoryLinkedList Data Structure
 * Tests doubly linked list behavior, bidirectional operations, and filtering
 * 
 * Validates Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9
 */

import { HistoryNode, HistoryLinkedList } from './HistoryLinkedList.js';

describe('HistoryLinkedList Data Structure', () => {
  let list;

  beforeEach(() => {
    list = new HistoryLinkedList();
  });

  // Helper function to create history entry
  function createHistoryEntry(id, action, medicineId, medicineName, timestamp) {
    return {
      id,
      action, // 'ADD', 'UPDATE', 'DELETE', 'DISPENSE'
      medicineId,
      medicineName,
      details: `${action} operation on ${medicineName}`,
      timestamp: timestamp || new Date(),
      userId: 'user1'
    };
  }

  describe('HistoryNode Class', () => {
    test('should create node with data and null pointers', () => {
      const entry = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const node = new HistoryNode(entry);

      expect(node.data).toEqual(entry);
      expect(node.next).toBeNull();
      expect(node.prev).toBeNull();
    });
  });

  describe('Constructor and Basic State', () => {
    test('should initialize empty list with correct properties', () => {
      expect(list.isEmpty()).toBe(true);
      expect(list.size()).toBe(0);
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
    });
  });

  describe('Add to Front Operations (Requirement 6.1)', () => {
    test('should add first entry to empty list', () => {
      const entry = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      list.addToFront(entry);

      expect(list.isEmpty()).toBe(false);
      expect(list.size()).toBe(1);
      expect(list.head.data).toEqual(entry);
      expect(list.tail.data).toEqual(entry);
      expect(list.head.next).toBeNull();
      expect(list.head.prev).toBeNull();
    });

    test('should add multiple entries to front maintaining order', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');
      const entry3 = createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol');

      list.addToFront(entry1);
      list.addToFront(entry2);
      list.addToFront(entry3);

      expect(list.size()).toBe(3);
      expect(list.head.data).toEqual(entry3); // Last added is at head
      expect(list.tail.data).toEqual(entry1); // First added is at tail
    });

    test('should maintain bidirectional links when adding to front', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');

      list.addToFront(entry1);
      list.addToFront(entry2);

      // Check forward links
      expect(list.head.next.data).toEqual(entry1);
      expect(list.head.next.next).toBeNull();

      // Check backward links
      expect(list.tail.prev.data).toEqual(entry2);
      expect(list.tail.prev.prev).toBeNull();
    });

    test('should complete addToFront in O(1) time', () => {
      const entry = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      
      const start = performance.now();
      list.addToFront(entry);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(1); // Should be nearly instantaneous
    });
  });

  describe('Add to Back Operations (Requirement 6.2)', () => {
    test('should add first entry to empty list', () => {
      const entry = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      list.addToBack(entry);

      expect(list.isEmpty()).toBe(false);
      expect(list.size()).toBe(1);
      expect(list.head.data).toEqual(entry);
      expect(list.tail.data).toEqual(entry);
    });

    test('should add multiple entries to back maintaining order', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');
      const entry3 = createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol');

      list.addToBack(entry1);
      list.addToBack(entry2);
      list.addToBack(entry3);

      expect(list.size()).toBe(3);
      expect(list.head.data).toEqual(entry1); // First added is at head
      expect(list.tail.data).toEqual(entry3); // Last added is at tail
    });

    test('should maintain bidirectional links when adding to back', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');

      list.addToBack(entry1);
      list.addToBack(entry2);

      // Check forward links
      expect(list.head.next.data).toEqual(entry2);
      
      // Check backward links
      expect(list.tail.prev.data).toEqual(entry1);
    });

    test('should complete addToBack in O(1) time', () => {
      const entry = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      
      const start = performance.now();
      list.addToBack(entry);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(1);
    });
  });

  describe('Remove from Front Operations (Requirement 6.3)', () => {
    test('should return null when removing from empty list', () => {
      expect(list.removeFromFront()).toBeNull();
      expect(list.size()).toBe(0);
    });

    test('should remove and return single entry', () => {
      const entry = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      list.addToFront(entry);

      const removed = list.removeFromFront();

      expect(removed).toEqual(entry);
      expect(list.isEmpty()).toBe(true);
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
    });

    test('should remove entries in FIFO order when added to back', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');
      const entry3 = createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol');

      list.addToBack(entry1);
      list.addToBack(entry2);
      list.addToBack(entry3);

      expect(list.removeFromFront()).toEqual(entry1);
      expect(list.removeFromFront()).toEqual(entry2);
      expect(list.removeFromFront()).toEqual(entry3);
      expect(list.isEmpty()).toBe(true);
    });

    test('should maintain proper links after removal', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');
      const entry3 = createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol');

      list.addToBack(entry1);
      list.addToBack(entry2);
      list.addToBack(entry3);

      list.removeFromFront();

      expect(list.size()).toBe(2);
      expect(list.head.data).toEqual(entry2);
      expect(list.head.prev).toBeNull(); // New head should have no prev
      expect(list.tail.data).toEqual(entry3);
    });

    test('should complete removeFromFront in O(1) time', () => {
      list.addToFront(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin'));
      
      const start = performance.now();
      list.removeFromFront();
      const end = performance.now();
      
      expect(end - start).toBeLessThan(1);
    });
  });

  describe('Remove from Back Operations (Requirement 6.4)', () => {
    test('should return null when removing from empty list', () => {
      expect(list.removeFromBack()).toBeNull();
      expect(list.size()).toBe(0);
    });

    test('should remove and return single entry', () => {
      const entry = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      list.addToBack(entry);

      const removed = list.removeFromBack();

      expect(removed).toEqual(entry);
      expect(list.isEmpty()).toBe(true);
    });

    test('should remove entries in LIFO order when added to back', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');
      const entry3 = createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol');

      list.addToBack(entry1);
      list.addToBack(entry2);
      list.addToBack(entry3);

      expect(list.removeFromBack()).toEqual(entry3);
      expect(list.removeFromBack()).toEqual(entry2);
      expect(list.removeFromBack()).toEqual(entry1);
      expect(list.isEmpty()).toBe(true);
    });

    test('should maintain proper links after removal', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');
      const entry3 = createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol');

      list.addToBack(entry1);
      list.addToBack(entry2);
      list.addToBack(entry3);

      list.removeFromBack();

      expect(list.size()).toBe(2);
      expect(list.tail.data).toEqual(entry2);
      expect(list.tail.next).toBeNull(); // New tail should have no next
      expect(list.head.data).toEqual(entry1);
    });

    test('should complete removeFromBack in O(1) time', () => {
      list.addToBack(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin'));
      
      const start = performance.now();
      list.removeFromBack();
      const end = performance.now();
      
      expect(end - start).toBeLessThan(1);
    });
  });

  describe('Get Recent History (Requirement 6.5)', () => {
    test('should return empty array for empty list', () => {
      expect(list.getRecentHistory(5)).toEqual([]);
    });

    test('should return all entries when count exceeds size', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');

      list.addToFront(entry1);
      list.addToFront(entry2);

      const recent = list.getRecentHistory(10);
      expect(recent.length).toBe(2);
      expect(recent[0]).toEqual(entry2); // Most recent first
      expect(recent[1]).toEqual(entry1);
    });

    test('should return N most recent entries from head', () => {
      const entries = [];
      for (let i = 1; i <= 5; i++) {
        const entry = createHistoryEntry(`h${i}`, 'ADD', `m${i}`, `Medicine ${i}`);
        entries.push(entry);
        list.addToFront(entry); // Adding to front, so h5 will be at head
      }

      const recent = list.getRecentHistory(3);
      expect(recent.length).toBe(3);
      expect(recent[0].id).toBe('h5'); // Most recent
      expect(recent[1].id).toBe('h4');
      expect(recent[2].id).toBe('h3');
    });

    test('should maintain chronological order (newest first)', () => {
      const now = new Date();
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin', new Date(now.getTime() - 3000));
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen', new Date(now.getTime() - 2000));
      const entry3 = createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol', new Date(now.getTime() - 1000));

      list.addToFront(entry3);
      list.addToFront(entry2);
      list.addToFront(entry1);

      const recent = list.getRecentHistory(3);
      expect(recent[0]).toEqual(entry1);
      expect(recent[1]).toEqual(entry2);
      expect(recent[2]).toEqual(entry3);
    });
  });

  describe('Filter by Medicine ID (Requirement 6.6)', () => {
    beforeEach(() => {
      list.addToBack(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin'));
      list.addToBack(createHistoryEntry('h2', 'UPDATE', 'm1', 'Aspirin'));
      list.addToBack(createHistoryEntry('h3', 'DISPENSE', 'm2', 'Ibuprofen'));
      list.addToBack(createHistoryEntry('h4', 'DELETE', 'm3', 'Paracetamol'));
      list.addToBack(createHistoryEntry('h5', 'UPDATE', 'm1', 'Aspirin'));
    });

    test('should return all entries for a specific medicine ID', () => {
      const m1History = list.getHistoryByMedicineId('m1');
      
      expect(m1History.length).toBe(3);
      expect(m1History[0].id).toBe('h1');
      expect(m1History[1].id).toBe('h2');
      expect(m1History[2].id).toBe('h5');
      m1History.forEach(entry => {
        expect(entry.medicineId).toBe('m1');
      });
    });

    test('should return empty array for non-existent medicine ID', () => {
      const result = list.getHistoryByMedicineId('m999');
      expect(result).toEqual([]);
    });

    test('should return entries in chronological order', () => {
      const m1History = list.getHistoryByMedicineId('m1');
      // Since we added to back, order should be maintained
      expect(m1History[0].action).toBe('ADD');
      expect(m1History[1].action).toBe('UPDATE');
      expect(m1History[2].action).toBe('UPDATE');
    });
  });

  describe('Filter by Action Type (Requirement 6.7)', () => {
    beforeEach(() => {
      list.addToBack(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin'));
      list.addToBack(createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen'));
      list.addToBack(createHistoryEntry('h3', 'DISPENSE', 'm3', 'Paracetamol'));
      list.addToBack(createHistoryEntry('h4', 'DELETE', 'm4', 'Amoxicillin'));
      list.addToBack(createHistoryEntry('h5', 'ADD', 'm5', 'Vitamin C'));
    });

    test('should return all ADD actions', () => {
      const addActions = list.getHistoryByAction('ADD');
      
      expect(addActions.length).toBe(2);
      expect(addActions[0].id).toBe('h1');
      expect(addActions[1].id).toBe('h5');
      addActions.forEach(entry => {
        expect(entry.action).toBe('ADD');
      });
    });

    test('should return all UPDATE actions', () => {
      const updateActions = list.getHistoryByAction('UPDATE');
      expect(updateActions.length).toBe(1);
      expect(updateActions[0].id).toBe('h2');
    });

    test('should return all DISPENSE actions', () => {
      const dispenseActions = list.getHistoryByAction('DISPENSE');
      expect(dispenseActions.length).toBe(1);
      expect(dispenseActions[0].id).toBe('h3');
    });

    test('should return all DELETE actions', () => {
      const deleteActions = list.getHistoryByAction('DELETE');
      expect(deleteActions.length).toBe(1);
      expect(deleteActions[0].id).toBe('h4');
    });

    test('should return empty array for non-existent action type', () => {
      const result = list.getHistoryByAction('UNKNOWN');
      expect(result).toEqual([]);
    });
  });

  describe('Filter by Date Range (Requirement 6.8)', () => {
    test('should return entries within date range', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      list.addToBack(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin', threeDaysAgo));
      list.addToBack(createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen', twoDaysAgo));
      list.addToBack(createHistoryEntry('h3', 'DISPENSE', 'm3', 'Paracetamol', yesterday));
      list.addToBack(createHistoryEntry('h4', 'DELETE', 'm4', 'Amoxicillin', now));

      const rangeEntries = list.getHistoryInRange(twoDaysAgo, yesterday);
      
      expect(rangeEntries.length).toBe(2);
      expect(rangeEntries[0].id).toBe('h2');
      expect(rangeEntries[1].id).toBe('h3');
    });

    test('should include entries on boundary dates (inclusive)', () => {
      const startDate = new Date('2024-01-01');
      const midDate = new Date('2024-01-15');
      const endDate = new Date('2024-01-31');

      list.addToBack(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin', startDate));
      list.addToBack(createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen', midDate));
      list.addToBack(createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol', endDate));

      const rangeEntries = list.getHistoryInRange(startDate, endDate);
      
      expect(rangeEntries.length).toBe(3);
      expect(rangeEntries.map(e => e.id)).toEqual(['h1', 'h2', 'h3']);
    });

    test('should return empty array when no entries in range', () => {
      const now = new Date();
      const futureStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const futureEnd = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      list.addToBack(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin', now));

      const rangeEntries = list.getHistoryInRange(futureStart, futureEnd);
      expect(rangeEntries).toEqual([]);
    });
  });

  describe('Find and Filter Operations', () => {
    beforeEach(() => {
      list.addToBack(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin'));
      list.addToBack(createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen'));
      list.addToBack(createHistoryEntry('h3', 'DISPENSE', 'm3', 'Paracetamol'));
    });

    test('should find first entry matching predicate', () => {
      const found = list.find(entry => entry.action === 'UPDATE');
      
      expect(found).not.toBeNull();
      expect(found.id).toBe('h2');
      expect(found.action).toBe('UPDATE');
    });

    test('should return null when no entry matches predicate', () => {
      const found = list.find(entry => entry.action === 'DELETE');
      expect(found).toBeNull();
    });

    test('should filter entries by custom predicate', () => {
      const filtered = list.filter(entry => entry.medicineName.includes('bu'));
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].medicineName).toBe('Ibuprofen');
    });

    test('should return empty array when no entries match filter', () => {
      const filtered = list.filter(entry => entry.medicineName === 'Nonexistent');
      expect(filtered).toEqual([]);
    });
  });

  describe('Chronological Order Maintenance (Requirement 6.9)', () => {
    test('should maintain chronological order with newest at head', () => {
      const now = new Date();
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin', new Date(now.getTime() - 3000));
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen', new Date(now.getTime() - 2000));
      const entry3 = createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol', new Date(now.getTime() - 1000));

      // Add in chronological order (oldest first)
      list.addToBack(entry1);
      list.addToBack(entry2);
      list.addToBack(entry3);

      // Since we added to back in chronological order, oldest is at head
      expect(list.head.data).toEqual(entry1);
      expect(list.tail.data).toEqual(entry3);

      // Clear and add with addToFront to get newest at head
      list.clear();
      list.addToFront(entry1); // Oldest
      list.addToFront(entry2);
      list.addToFront(entry3); // Newest

      // Now newest is at head
      expect(list.head.data).toEqual(entry3);
      expect(list.tail.data).toEqual(entry1);
    });

    test('should traverse from newest to oldest', () => {
      const entries = [];
      for (let i = 1; i <= 5; i++) {
        const entry = createHistoryEntry(`h${i}`, 'ADD', `m${i}`, `Medicine ${i}`);
        entries.unshift(entry); // Keep newest first in array
        list.addToFront(entry); // Add to front
      }

      const array = list.toArray();
      expect(array).toEqual(entries);
    });
  });

  describe('Utility Methods', () => {
    test('should clear all entries from list', () => {
      list.addToBack(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin'));
      list.addToBack(createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen'));
      
      expect(list.size()).toBe(2);
      
      list.clear();
      
      expect(list.isEmpty()).toBe(true);
      expect(list.size()).toBe(0);
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
    });

    test('should convert list to array maintaining order', () => {
      const entry1 = createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin');
      const entry2 = createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen');
      const entry3 = createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol');

      list.addToBack(entry1);
      list.addToBack(entry2);
      list.addToBack(entry3);

      const array = list.toArray();

      expect(array.length).toBe(3);
      expect(array[0]).toEqual(entry1);
      expect(array[1]).toEqual(entry2);
      expect(array[2]).toEqual(entry3);
    });

    test('should return empty array for empty list', () => {
      expect(list.toArray()).toEqual([]);
    });
  });

  describe('Bidirectional Traversal', () => {
    test('should traverse forward through all nodes', () => {
      const entries = [];
      for (let i = 1; i <= 3; i++) {
        const entry = createHistoryEntry(`h${i}`, 'ADD', `m${i}`, `Medicine ${i}`);
        entries.push(entry);
        list.addToBack(entry);
      }

      // Manual forward traversal
      const forward = [];
      let current = list.head;
      while (current) {
        forward.push(current.data);
        current = current.next;
      }

      expect(forward).toEqual(entries);
    });

    test('should traverse backward through all nodes', () => {
      const entries = [];
      for (let i = 1; i <= 3; i++) {
        const entry = createHistoryEntry(`h${i}`, 'ADD', `m${i}`, `Medicine ${i}`);
        entries.push(entry);
        list.addToBack(entry);
      }

      // Manual backward traversal
      const backward = [];
      let current = list.tail;
      while (current) {
        backward.push(current.data);
        current = current.prev;
      }

      expect(backward).toEqual([...entries].reverse());
    });
  });

  describe('Edge Cases', () => {
    test('should handle alternating add operations', () => {
      list.addToFront(createHistoryEntry('h1', 'ADD', 'm1', 'Aspirin'));
      list.addToBack(createHistoryEntry('h2', 'UPDATE', 'm2', 'Ibuprofen'));
      list.addToFront(createHistoryEntry('h3', 'DELETE', 'm3', 'Paracetamol'));
      list.addToBack(createHistoryEntry('h4', 'DISPENSE', 'm4', 'Amoxicillin'));

      expect(list.size()).toBe(4);
      expect(list.head.data.id).toBe('h3');
      expect(list.tail.data.id).toBe('h4');

      const array = list.toArray();
      expect(array.map(e => e.id)).toEqual(['h3', 'h1', 'h2', 'h4']);
    });

    test('should handle alternating remove operations', () => {
      for (let i = 1; i <= 5; i++) {
        list.addToBack(createHistoryEntry(`h${i}`, 'ADD', `m${i}`, `Medicine ${i}`));
      }

      list.removeFromFront(); // Remove h1
      list.removeFromBack();  // Remove h5
      list.removeFromFront(); // Remove h2

      expect(list.size()).toBe(2);
      expect(list.head.data.id).toBe('h3');
      expect(list.tail.data.id).toBe('h4');
    });

    test('should handle large number of entries efficiently', () => {
      const count = 1000;
      
      const startAdd = performance.now();
      for (let i = 0; i < count; i++) {
        list.addToFront(createHistoryEntry(`h${i}`, 'ADD', `m${i}`, `Medicine ${i}`));
      }
      const endAdd = performance.now();
      
      expect(list.size()).toBe(count);
      expect(endAdd - startAdd).toBeLessThan(100); // Should complete quickly

      const startFilter = performance.now();
      const filtered = list.filter(entry => parseInt(entry.id.substring(1)) % 2 === 0);
      const endFilter = performance.now();
      
      expect(filtered.length).toBe(count / 2);
      expect(endFilter - startFilter).toBeLessThan(50); // O(n) operation
    });
  });
});
