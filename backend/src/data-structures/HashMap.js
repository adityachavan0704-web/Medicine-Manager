/**
 * MedicineHashMap Data Structure for O(1) Medicine Lookups
 * Custom hash table implementation with chaining for collision resolution
 * Used for fast medicine retrieval by ID, name, batch, and category
 * 
 * Implements Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 16.1
 */
class MedicineHashMap {
  /**
   * Initialize HashMap with bucket array
   * Preconditions: initialCapacity > 0, 0 < loadFactor < 1
   * Postconditions: empty hash map with specified capacity
   * @param {number} initialCapacity - Initial number of buckets (default 16)
   * @param {number} loadFactor - Resize threshold (default 0.75)
   */
  constructor(initialCapacity = 16, loadFactor = 0.75) {
    this.capacity = initialCapacity;
    this.loadFactor = loadFactor;
    this._size = 0;
    this.buckets = Array.from({ length: this.capacity }, () => []);
  }

  /**
   * Hash function using polynomial rolling hash
   * Preconditions: key is non-empty string
   * Postconditions: returns valid bucket index [0, capacity)
   * Time Complexity: O(k) where k is key length
   * @param {string} key - Key to hash
   * @returns {number} Bucket index in range [0, capacity)
   */
  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.capacity;
    }
    return Math.abs(hash);
  }

  /**
   * Insert or update medicine in hash map
   * Preconditions: key is non-empty string, value is valid IMedicine object
   * Postconditions: medicine added/updated, resized if load factor exceeded
   * Time Complexity: O(1) average case, O(n) worst case with collisions
   * Implements Requirements: 4.1, 4.2
   * @param {string} key - Medicine ID (unique identifier)
   * @param {Object} value - Medicine object
   */
  set(key, value) {
    if (this.shouldResize()) {
      this.resize();
    }
    
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    // Check if key exists (update case)
    const existingIndex = bucket.findIndex(entry => entry.key === key);
    if (existingIndex !== -1) {
      bucket[existingIndex].value = value;
      return;
    }
    
    // Insert new entry (collision handled via chaining)
    bucket.push({ key, value });
    this._size++;
  }

  /**
   * Get medicine by key
   * Preconditions: none
   * Postconditions: returns medicine or undefined, map unchanged
   * Time Complexity: O(1) average case
   * Implements Requirements: 4.3, 16.1
   * @param {string} key - Medicine ID
   * @returns {Object|undefined} Medicine object or undefined
   */
  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const entry = bucket.find(e => e.key === key);
    return entry?.value;
  }

  /**
   * Check if key exists in hash map
   * Preconditions: none
   * Postconditions: returns boolean, map unchanged
   * Time Complexity: O(1) average case
   * Implements Requirements: 4.4
   * @param {string} key - Medicine ID
   * @returns {boolean} True if key exists
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Delete medicine by key
   * Preconditions: none
   * Postconditions: if found, medicine removed and returns true
   * Time Complexity: O(1) average case
   * Implements Requirements: 4.5
   * Loop Invariant: bucket maintains collision chain integrity after removal
   * @param {string} key - Medicine ID
   * @returns {boolean} True if deleted, false if not found
   */
  delete(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const entryIndex = bucket.findIndex(e => e.key === key);
    
    if (entryIndex === -1) return false;
    
    bucket.splice(entryIndex, 1);
    this._size--;
    return true;
  }

  /**
   * Search medicines by name (partial match, case-insensitive)
   * Preconditions: none
   * Postconditions: returns array of matching medicines, map unchanged
   * Time Complexity: O(n) where n is total medicines
   * Implements Requirements: 4.6, 8.1
   * @param {string} name - Search term for medicine name
   * @returns {Array} Array of matching medicines
   */
  searchByName(name) {
    const searchTerm = name.toLowerCase();
    const results = [];
    
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        if (entry.value.name.toLowerCase().includes(searchTerm)) {
          results.push(entry.value);
        }
      }
    }
    
    return results;
  }

  /**
   * Search medicine by exact batch number
   * Preconditions: none
   * Postconditions: returns medicine or undefined, map unchanged
   * Time Complexity: O(n) - requires linear search as batch is not the key
   * Note: Could be optimized to O(1) with secondary index on batch numbers
   * Implements Requirements: 4.7, 8.2
   * @param {string} batchNumber - Batch number to find
   * @returns {Object|undefined} Medicine object or undefined
   */
  searchByBatch(batchNumber) {
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        if (entry.value.batchNumber === batchNumber) {
          return entry.value;
        }
      }
    }
    return undefined;
  }

  /**
   * Search medicines by category
   * Preconditions: none
   * Postconditions: returns array of medicines in category, map unchanged
   * Time Complexity: O(n) where n is total medicines
   * Implements Requirements: 4.8, 8.3
   * @param {string} category - Category name
   * @returns {Array} Array of medicines in category
   */
  searchByCategory(category) {
    const results = [];
    
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        if (entry.value.category === category) {
          results.push(entry.value);
        }
      }
    }
    
    return results;
  }

  /**
   * Get all medicines from hash map
   * Preconditions: none
   * Postconditions: returns array of all medicines, map unchanged
   * Time Complexity: O(n) where n is total medicines
   * @returns {Array} Array of all medicines
   */
  getAllMedicines() {
    const medicines = [];
    
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        medicines.push(entry.value);
      }
    }
    
    return medicines;
  }

  /**
   * Get current size (number of entries)
   * Preconditions: none
   * Postconditions: returns integer size, map unchanged
   * Time Complexity: O(1)
   * Implements Requirements: 4.9
   * @returns {number} Number of entries in hash map
   */
  size() {
    return this._size;
  }

  /**
   * Clear all entries from hash map
   * Preconditions: none
   * Postconditions: all entries removed, size reset to 0
   * Time Complexity: O(1)
   */
  clear() {
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this._size = 0;
  }

  /**
   * Check if resize is needed based on load factor
   * Preconditions: none
   * Postconditions: returns boolean, map unchanged
   * Time Complexity: O(1)
   * Implements Requirements: 4.2
   * @returns {boolean} True if load factor exceeds threshold
   */
  shouldResize() {
    return this._size / this.capacity > this.loadFactor;
  }

  /**
   * Resize hash map and rehash all entries
   * Preconditions: none
   * Postconditions: capacity doubled, all entries rehashed, load factor reduced
   * Time Complexity: O(n) where n is number of entries
   * Implements Requirements: 4.2
   * Loop Invariant: all entries from old buckets are rehashed into new buckets
   */
  resize() {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this._size = 0;
    
    // Rehash all entries with new capacity
    for (const bucket of oldBuckets) {
      for (const entry of bucket) {
        this.set(entry.key, entry.value);
      }
    }
  }

  /**
   * Get current load factor (size / capacity ratio)
   * Preconditions: none
   * Postconditions: returns load factor, map unchanged
   * Time Complexity: O(1)
   * @returns {number} Current load factor (0 to 1)
   */
  getLoadFactor() {
    return this._size / this.capacity;
  }

  /**
   * Get collision statistics for analysis
   * Preconditions: none
   * Postconditions: returns statistics object, map unchanged
   * Time Complexity: O(m) where m is number of buckets
   * @returns {Object} Statistics with collision count, max chain length, bucket distribution
   */
  getCollisionStats() {
    let collisions = 0;
    let maxChainLength = 0;
    let nonEmptyBuckets = 0;
    
    for (const bucket of this.buckets) {
      if (bucket.length > 0) {
        nonEmptyBuckets++;
        if (bucket.length > 1) {
          collisions += bucket.length - 1;
        }
        maxChainLength = Math.max(maxChainLength, bucket.length);
      }
    }
    
    return {
      totalCollisions: collisions,
      maxChainLength,
      nonEmptyBuckets,
      emptyBuckets: this.capacity - nonEmptyBuckets
    };
  }

  /**
   * Get bucket structure for visualization
   * Preconditions: none
   * Postconditions: returns bucket structure array, map unchanged
   * Time Complexity: O(m + n) where m is buckets, n is total entries
   * Used for data structure visualization page
   * Implements Requirements: 12.3, 12.4
   * @returns {Array} Array of bucket objects with index and entries
   */
  getBucketStructure() {
    return this.buckets.map((bucket, index) => ({
      index,
      entries: bucket.map(entry => ({
        key: entry.key,
        medicine: entry.value
      }))
    }));
  }

  /**
   * Check if hash map is empty
   * Time Complexity: O(1)
   * @returns {boolean} True if empty
   */
  isEmpty() {
    return this._size === 0;
  }

  /**
   * Get all keys in hash map
   * Time Complexity: O(n)
   * @returns {Array} Array of all keys
   */
  keys() {
    const keyList = [];
    
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        keyList.push(entry.key);
      }
    }
    
    return keyList;
  }

  /**
   * Get all values in hash map
   * Time Complexity: O(n)
   * @returns {Array} Array of all values (medicines)
   */
  values() {
    return this.getAllMedicines();
  }

  /**
   * Get all key-value pairs
   * Time Complexity: O(n)
   * @returns {Array} Array of [key, value] pairs
   */
  entries() {
    const entryList = [];
    
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        entryList.push([entry.key, entry.value]);
      }
    }
    
    return entryList;
  }
}

export default MedicineHashMap;
