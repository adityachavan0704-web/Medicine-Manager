/**
 * MinHeap Data Structure for Medicine Expiry Priority
 * Maintains medicines sorted by expiry date (earliest expiry = highest priority)
 * Used for FEFO (First Expire First Out) recommendations
 */
class MinHeap {
  constructor() {
    this.heap = [];
  }

  /**
   * Insert medicine into heap
   * Preconditions: medicine is valid IMedicine object
   * Postconditions: medicine added to heap, min-heap property maintained
   * Time Complexity: O(log n)
   * @param {Object} medicine - Medicine object with expiryDate
   */
  insert(medicine) {
    this.heap.push(medicine);
    this.heapifyUp(this.heap.length - 1);
  }

  /**
   * Extract medicine with earliest expiry date
   * Preconditions: heap is not empty
   * Postconditions: returns and removes root element, heap property maintained
   * Time Complexity: O(log n)
   * @returns {Object|null} Medicine with earliest expiry or null if empty
   */
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    
    return min;
  }

  /**
   * Peek at medicine with earliest expiry without removing
   * Preconditions: none
   * Postconditions: returns root element or null, heap unchanged
   * Time Complexity: O(1)
   * @returns {Object|null} Medicine with earliest expiry or null if empty
   */
  peekMin() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * Get all medicines expiring within specified days
   * Preconditions: days >= 0
   * Postconditions: returns array of medicines expiring within days
   * Time Complexity: O(n)
   * @param {number} days - Number of days from today
   * @returns {Array} Medicines expiring within days
   */
  getMedicinesExpiringWithin(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    const today = new Date();
    
    return this.heap.filter(medicine => {
      const expiryDate = new Date(medicine.expiryDate);
      return expiryDate <= cutoffDate && expiryDate >= today;
    });
  }

  /**
   * Get top N medicines by earliest expiry
   * Preconditions: n > 0
   * Postconditions: returns array of N medicines with earliest expiry dates
   * Time Complexity: O(n log n) - creates copy and extracts N times
   * @param {number} n - Number of medicines to return
   * @returns {Array} Top N expiring medicines
   */
  getTopNExpiring(n) {
    const result = [];
    const tempHeap = new MinHeap();
    
    // Copy heap
    this.heap.forEach(m => tempHeap.insert({...m}));
    
    // Extract N times
    for (let i = 0; i < n && tempHeap.size() > 0; i++) {
      const min = tempHeap.extractMin();
      if (min) result.push(min);
    }
    
    return result;
  }

  /**
   * Remove medicine by ID
   * Preconditions: none
   * Postconditions: if found, medicine removed and heap property maintained
   * Time Complexity: O(n) - linear search + O(log n) heapify
   * @param {string} id - Medicine ID
   * @returns {boolean} True if removed, false if not found
   */
  remove(id) {
    const index = this.heap.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    // Swap with last element
    this.swap(index, this.heap.length - 1);
    this.heap.pop();
    
    // Reheapify from index
    if (index < this.heap.length) {
      this.heapifyDown(index);
      this.heapifyUp(index);
    }
    
    return true;
  }

  /**
   * Update medicine and maintain heap property
   * Preconditions: id exists in heap
   * Postconditions: medicine updated, heap property maintained
   * Time Complexity: O(n) - search + O(log n) heapify
   * @param {string} id - Medicine ID
   * @param {Object} updates - Partial medicine updates
   * @returns {boolean} True if updated, false if not found
   */
  update(id, updates) {
    const index = this.heap.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    Object.assign(this.heap[index], updates);
    
    // Reheapify - could move up or down
    this.heapifyDown(index);
    this.heapifyUp(index);
    
    return true;
  }

  /**
   * Restore heap property upward from index
   * Preconditions: index is valid
   * Postconditions: heap property maintained from index to root
   * Time Complexity: O(log n)
   * Loop Invariant: subtree rooted at parent(index) satisfies heap property
   * @param {number} index - Starting index
   */
  heapifyUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      // If parent is smaller or equal, heap property satisfied
      if (this.compare(this.heap[parentIndex], this.heap[index]) <= 0) {
        break;
      }
      
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  /**
   * Restore heap property downward from index
   * Preconditions: index is valid
   * Postconditions: heap property maintained from index to leaves
   * Time Complexity: O(log n)
   * Loop Invariant: subtree rooted at index satisfies heap property except possibly children
   * @param {number} index - Starting index
   */
  heapifyDown(index) {
    const length = this.heap.length;
    
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;
      
      // Find smallest among node and children
      if (leftChild < length && this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
        smallest = leftChild;
      }
      
      if (rightChild < length && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
        smallest = rightChild;
      }
      
      // If node is smallest, heap property satisfied
      if (smallest === index) break;
      
      this.swap(index, smallest);
      index = smallest;
    }
  }

  /**
   * Swap two elements in heap
   * Time Complexity: O(1)
   */
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  /**
   * Compare two medicines by expiry date
   * Returns: negative if a < b, 0 if equal, positive if a > b
   * Time Complexity: O(1)
   * @param {Object} a - First medicine
   * @param {Object} b - Second medicine
   * @returns {number} Negative if a < b, 0 if equal, positive if a > b
   */
  compare(a, b) {
    const dateA = new Date(a.expiryDate);
    const dateB = new Date(b.expiryDate);
    return dateA.getTime() - dateB.getTime();
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  toArray() {
    return [...this.heap];
  }

  clear() {
    this.heap = [];
  }
}

export default MinHeap;
