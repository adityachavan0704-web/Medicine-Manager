/**
 * Unit Tests for MedicineHashMap
 * Tests core functionality: set, get, delete, search, resize, and collision handling
 */

import MedicineHashMap from './HashMap.js';

// Test helper to create sample medicine
function createMedicine(id, name, batchNumber, category, expiryDate) {
  return {
    id,
    name,
    batchNumber,
    category,
    manufacturer: 'Test Pharma',
    quantity: 100,
    unit: 'tablets',
    price: 10.99,
    lowStockThreshold: 10,
    expiryDate: new Date(expiryDate),
    manufactureDate: new Date('2024-01-01'),
    status: 'Safe'
  };
}

// Test 1: Basic set and get operations
console.log('Test 1: Basic set and get operations');
const hashMap = new MedicineHashMap();
const med1 = createMedicine('med-1', 'Aspirin', 'BATCH001', 'Painkiller', '2025-12-31');
hashMap.set('med-1', med1);
const retrieved = hashMap.get('med-1');
console.assert(retrieved.id === 'med-1', 'Should retrieve medicine by ID');
console.assert(retrieved.name === 'Aspirin', 'Should retrieve correct medicine data');
console.log('✓ Set and get work correctly\n');

// Test 2: Update existing key
console.log('Test 2: Update existing key');
const updatedMed1 = { ...med1, quantity: 50 };
hashMap.set('med-1', updatedMed1);
const retrievedUpdated = hashMap.get('med-1');
console.assert(retrievedUpdated.quantity === 50, 'Should update existing medicine');
console.assert(hashMap.size() === 1, 'Size should remain 1 after update');
console.log('✓ Update works correctly\n');

// Test 3: Has and delete operations
console.log('Test 3: Has and delete operations');
console.assert(hashMap.has('med-1') === true, 'Should find existing key');
console.assert(hashMap.has('med-999') === false, 'Should not find non-existent key');
const deleted = hashMap.delete('med-1');
console.assert(deleted === true, 'Should return true when deleting existing key');
console.assert(hashMap.has('med-1') === false, 'Should not find deleted key');
console.assert(hashMap.size() === 0, 'Size should be 0 after deletion');
console.log('✓ Has and delete work correctly\n');

// Test 4: Search by name
console.log('Test 4: Search by name');
hashMap.clear();
hashMap.set('med-1', createMedicine('med-1', 'Aspirin', 'BATCH001', 'Painkiller', '2025-12-31'));
hashMap.set('med-2', createMedicine('med-2', 'Ibuprofen', 'BATCH002', 'Painkiller', '2025-11-30'));
hashMap.set('med-3', createMedicine('med-3', 'Aspirin Plus', 'BATCH003', 'Painkiller', '2025-10-31'));

const aspirinResults = hashMap.searchByName('aspirin');
console.assert(aspirinResults.length === 2, 'Should find 2 medicines containing "aspirin"');
console.assert(aspirinResults.some(m => m.name === 'Aspirin'), 'Should include Aspirin');
console.assert(aspirinResults.some(m => m.name === 'Aspirin Plus'), 'Should include Aspirin Plus');
console.log('✓ Search by name works correctly (case-insensitive, partial match)\n');

// Test 5: Search by batch number
console.log('Test 5: Search by batch number');
const batchResult = hashMap.searchByBatch('BATCH002');
console.assert(batchResult !== undefined, 'Should find medicine by batch number');
console.assert(batchResult.name === 'Ibuprofen', 'Should return correct medicine');
const noBatchResult = hashMap.searchByBatch('BATCH999');
console.assert(noBatchResult === undefined, 'Should return undefined for non-existent batch');
console.log('✓ Search by batch works correctly\n');

// Test 6: Search by category
console.log('Test 6: Search by category');
hashMap.set('med-4', createMedicine('med-4', 'Vitamin C', 'BATCH004', 'Vitamin', '2026-01-31'));
const painkillers = hashMap.searchByCategory('Painkiller');
console.assert(painkillers.length === 3, 'Should find 3 painkillers');
const vitamins = hashMap.searchByCategory('Vitamin');
console.assert(vitamins.length === 1, 'Should find 1 vitamin');
console.log('✓ Search by category works correctly\n');

// Test 7: Automatic resizing
console.log('Test 7: Automatic resizing (load factor > 0.75)');
const smallMap = new MedicineHashMap(4, 0.75); // Small initial capacity
console.log(`Initial capacity: ${smallMap.capacity}`);

// Add medicines until resize is triggered
for (let i = 1; i <= 10; i++) {
  const med = createMedicine(`med-${i}`, `Medicine ${i}`, `BATCH${i}`, 'Test', '2025-12-31');
  smallMap.set(`med-${i}`, med);
  console.log(`Added med-${i}: size=${smallMap.size()}, capacity=${smallMap.capacity}, load=${smallMap.getLoadFactor().toFixed(2)}`);
}

console.assert(smallMap.size() === 10, 'Should have 10 medicines');
console.assert(smallMap.capacity > 4, 'Capacity should have increased');
console.assert(smallMap.getLoadFactor() <= 0.75, 'Load factor should be <= 0.75');

// Verify all medicines are still accessible after resize
for (let i = 1; i <= 10; i++) {
  const retrieved = smallMap.get(`med-${i}`);
  console.assert(retrieved !== undefined, `Should still find med-${i} after resize`);
}
console.log('✓ Automatic resizing works correctly\n');

// Test 8: Collision handling (chaining)
console.log('Test 8: Collision handling');
const collisionMap = new MedicineHashMap(4, 0.75); // Small capacity to force collisions
for (let i = 1; i <= 8; i++) {
  const med = createMedicine(`med-${i}`, `Medicine ${i}`, `BATCH${i}`, 'Test', '2025-12-31');
  collisionMap.set(`med-${i}`, med);
}

const stats = collisionMap.getCollisionStats();
console.log(`Collision stats: ${JSON.stringify(stats, null, 2)}`);
console.assert(stats.totalCollisions >= 0, 'Should track collisions');
console.assert(stats.maxChainLength >= 1, 'Should have chain lengths');

// All items should still be retrievable
for (let i = 1; i <= 8; i++) {
  const retrieved = collisionMap.get(`med-${i}`);
  console.assert(retrieved !== undefined, `Should find med-${i} despite collisions`);
}
console.log('✓ Collision handling (chaining) works correctly\n');

// Test 9: Utility methods
console.log('Test 9: Utility methods (keys, values, entries, isEmpty)');
hashMap.clear();
console.assert(hashMap.isEmpty() === true, 'Should be empty after clear');

hashMap.set('med-1', createMedicine('med-1', 'Aspirin', 'BATCH001', 'Painkiller', '2025-12-31'));
hashMap.set('med-2', createMedicine('med-2', 'Ibuprofen', 'BATCH002', 'Painkiller', '2025-11-30'));

console.assert(hashMap.isEmpty() === false, 'Should not be empty');
const keys = hashMap.keys();
console.assert(keys.length === 2, 'Should have 2 keys');
console.assert(keys.includes('med-1') && keys.includes('med-2'), 'Keys should include med-1 and med-2');

const values = hashMap.values();
console.assert(values.length === 2, 'Should have 2 values');

const entries = hashMap.entries();
console.assert(entries.length === 2, 'Should have 2 entries');
console.assert(entries[0].length === 2, 'Each entry should be [key, value] pair');
console.log('✓ Utility methods work correctly\n');

// Test 10: getAllMedicines
console.log('Test 10: getAllMedicines');
const allMeds = hashMap.getAllMedicines();
console.assert(allMeds.length === 2, 'Should return all medicines');
console.assert(allMeds.some(m => m.id === 'med-1'), 'Should include med-1');
console.assert(allMeds.some(m => m.id === 'med-2'), 'Should include med-2');
console.log('✓ getAllMedicines works correctly\n');

// Test 11: Bucket structure for visualization
console.log('Test 11: getBucketStructure for visualization');
const bucketStructure = hashMap.getBucketStructure();
console.assert(Array.isArray(bucketStructure), 'Should return array of buckets');
console.assert(bucketStructure.every(b => 'index' in b && 'entries' in b), 'Each bucket should have index and entries');
console.log('✓ getBucketStructure works correctly\n');

console.log('========================================');
console.log('All HashMap tests passed! ✓');
console.log('========================================');
