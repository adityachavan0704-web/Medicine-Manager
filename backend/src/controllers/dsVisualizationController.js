const medicineService = require('../services/MedicineService');
const alertService = require('../services/AlertService');
const historyService = require('../services/HistoryService');

/**
 * Get MinHeap visualization data
 */
const getMinHeapVisualization = async (req, res, next) => {
  try {
    const heap = medicineService.minHeap.toArray();
    
    // Convert heap array to tree structure with levels
    const nodes = heap.map((medicine, index) => ({
      id: medicine.id,
      medicine: {
        name: medicine.name,
        batchNumber: medicine.batchNumber,
        expiryDate: medicine.expiryDate,
        daysUntilExpiry: medicine.daysUntilExpiry
      },
      level: Math.floor(Math.log2(index + 1)),
      position: index
    }));

    res.json({
      structure: 'minheap',
      nodes,
      size: heap.length,
      complexity: {
        insert: 'O(log n)',
        extractMin: 'O(log n)',
        peekMin: 'O(1)',
        remove: 'O(n)',
        update: 'O(n)'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get HashMap visualization data
 */
const getHashMapVisualization = async (req, res, next) => {
  try {
    const hashMap = medicineService.medicineMap;
    
    // Get bucket structure
    const buckets = hashMap.buckets.map((bucket, index) => ({
      index,
      entries: bucket.map(entry => ({
        key: entry.key,
        medicine: {
          id: entry.value.id,
          name: entry.value.name,
          batchNumber: entry.value.batchNumber
        }
      }))
    }));

    // Calculate collision count
    const collisions = buckets.filter(b => b.entries.length > 1).length;

    res.json({
      structure: 'hashmap',
      buckets: buckets.filter(b => b.entries.length > 0), // Only non-empty buckets
      capacity: hashMap.capacity,
      size: hashMap._size,
      loadFactor: (hashMap._size / hashMap.capacity).toFixed(2),
      collisions,
      complexity: {
        insert: 'O(1) avg',
        search: 'O(1) avg',
        delete: 'O(1) avg'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Queue visualization data
 */
const getQueueVisualization = async (req, res, next) => {
  try {
    const queue = alertService.alertQueue;
    
    // Get queue items
    const items = queue.queue.slice(queue.front, queue.rear + 1).map(alert => ({
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      medicineName: alert.medicineName,
      isRead: alert.isRead
    }));

    res.json({
      structure: 'queue',
      items,
      front: queue.front,
      rear: queue.rear,
      size: queue.size(),
      maxSize: queue.maxSize,
      complexity: {
        enqueue: 'O(1)',
        dequeue: 'O(1)',
        peek: 'O(1)'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get LinkedList visualization data
 */
const getLinkedListVisualization = async (req, res, next) => {
  try {
    const linkedList = historyService.historyList;
    
    // Traverse list and get nodes
    const nodes = [];
    let current = linkedList.head;
    
    while (current && nodes.length < 50) { // Limit to 50 for visualization
      nodes.push({
        data: {
          id: current.data.id,
          action: current.data.action,
          medicineName: current.data.medicineName,
          timestamp: current.data.timestamp
        },
        hasNext: current.next !== null,
        hasPrev: current.prev !== null
      });
      current = current.next;
    }

    res.json({
      structure: 'linkedlist',
      nodes,
      size: linkedList.size(),
      complexity: {
        insertFront: 'O(1)',
        insertBack: 'O(1)',
        removeFrom Front: 'O(1)',
        removeFromBack: 'O(1)',
        search: 'O(n)'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMinHeapVisualization,
  getHashMapVisualization,
  getQueueVisualization,
  getLinkedListVisualization
};
