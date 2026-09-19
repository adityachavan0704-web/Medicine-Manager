/**
 * HistoryNode class for doubly linked list
 * Contains history entry data and bidirectional pointers
 */
class HistoryNode {
  /**
   * Create a history node
   * @param {Object} data - History entry data
   */
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

/**
 * HistoryLinkedList Data Structure for Activity Tracking
 * Maintains chronological history of medicine operations using doubly linked list
 * Newest entries at the head, oldest at the tail
 */
class HistoryLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  /**
   * Add history entry to the front (head)
   * Time Complexity: O(1)
   * @param {Object} entry - History entry object
   */
  addToFront(entry) {
    const newNode = new HistoryNode(entry);
    
    if (this.isEmpty()) {
      // First node
      this.head = newNode;
      this.tail = newNode;
    } else {
      // Insert at head
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    
    this._size++;
  }

  /**
   * Add history entry to the back (tail)
   * Time Complexity: O(1)
   * @param {Object} entry - History entry object
   */
  addToBack(entry) {
    const newNode = new HistoryNode(entry);
    
    if (this.isEmpty()) {
      // First node
      this.head = newNode;
      this.tail = newNode;
    } else {
      // Insert at tail
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this._size++;
  }

  /**
   * Remove and return history entry from the front (head)
   * Time Complexity: O(1)
   * @returns {Object|null} History entry or null if empty
   */
  removeFromFront() {
    if (this.isEmpty()) return null;
    
    const removedData = this.head.data;
    
    if (this._size === 1) {
      // Only one node
      this.head = null;
      this.tail = null;
    } else {
      // Remove head
      this.head = this.head.next;
      this.head.prev = null;
    }
    
    this._size--;
    return removedData;
  }

  /**
   * Remove and return history entry from the back (tail)
   * Time Complexity: O(1)
   * @returns {Object|null} History entry or null if empty
   */
  removeFromBack() {
    if (this.isEmpty()) return null;
    
    const removedData = this.tail.data;
    
    if (this._size === 1) {
      // Only one node
      this.head = null;
      this.tail = null;
    } else {
      // Remove tail
      this.tail = this.tail.prev;
      this.tail.next = null;
    }
    
    this._size--;
    return removedData;
  }

  /**
   * Get N most recent history entries (from head)
   * Time Complexity: O(n)
   * @param {number} count - Number of entries to retrieve
   * @returns {Array} Recent history entries
   */
  getRecentHistory(count) {
    const result = [];
    let current = this.head;
    let retrieved = 0;
    
    while (current && retrieved < count) {
      result.push(current.data);
      current = current.next;
      retrieved++;
    }
    
    return result;
  }

  /**
   * Get all history entries for a specific medicine ID
   * Time Complexity: O(n)
   * @param {string} medicineId - Medicine ID to filter by
   * @returns {Array} History entries matching medicine ID
   */
  getHistoryByMedicineId(medicineId) {
    return this.filter(entry => entry.medicineId === medicineId);
  }

  /**
   * Get all history entries for a specific action type
   * Time Complexity: O(n)
   * @param {string} action - Action type (ADD, UPDATE, DELETE, DISPENSE)
   * @returns {Array} History entries matching action type
   */
  getHistoryByAction(action) {
    return this.filter(entry => entry.action === action);
  }

  /**
   * Get history entries within a date range
   * Time Complexity: O(n)
   * @param {Date} startDate - Start date (inclusive)
   * @param {Date} endDate - End date (inclusive)
   * @returns {Array} History entries within date range
   */
  getHistoryInRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= start && entryDate <= end;
    });
  }

  /**
   * Find first entry matching predicate
   * Time Complexity: O(n)
   * @param {Function} predicate - Function that returns true for matching entry
   * @returns {Object|null} First matching entry or null
   */
  find(predicate) {
    let current = this.head;
    
    while (current) {
      if (predicate(current.data)) {
        return current.data;
      }
      current = current.next;
    }
    
    return null;
  }

  /**
   * Filter entries by predicate
   * Time Complexity: O(n)
   * @param {Function} predicate - Function that returns true for matching entries
   * @returns {Array} All matching entries
   */
  filter(predicate) {
    const result = [];
    let current = this.head;
    
    while (current) {
      if (predicate(current.data)) {
        result.push(current.data);
      }
      current = current.next;
    }
    
    return result;
  }

  /**
   * Get the size of the linked list
   * Time Complexity: O(1)
   * @returns {number} Number of entries in the list
   */
  size() {
    return this._size;
  }

  /**
   * Check if the list is empty
   * Time Complexity: O(1)
   * @returns {boolean} True if empty, false otherwise
   */
  isEmpty() {
    return this._size === 0;
  }

  /**
   * Clear all entries from the list
   * Time Complexity: O(1)
   */
  clear() {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  /**
   * Convert linked list to array (from head to tail)
   * Time Complexity: O(n)
   * @returns {Array} Array of all history entries
   */
  toArray() {
    const result = [];
    let current = this.head;
    
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    
    return result;
  }
}

// Export both classes
export { HistoryNode, HistoryLinkedList };
export default HistoryLinkedList;
