/**
 * MedicineService - Business logic for medicine management
 * Uses custom data structures for efficient operations
 */
import MinHeap from '../data-structures/MinHeap.js';
import HashMap from '../data-structures/HashMap.js';
import StatusCalculator from '../utils/StatusCalculator.js';
import { promisePool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class MedicineService {
  constructor() {
    this.minHeap = new MinHeap();
    this.hashMap = new HashMap();
    this.isLoaded = false;
  }

  /**
   * Load all medicines from database into data structures
   * Time Complexity: O(n log n) - n inserts into heap
   */
  async loadFromDatabase() {
    try {
      const [medicines] = await promisePool.query(
        'SELECT * FROM medicines ORDER BY expiry_date ASC'
      );

      this.minHeap.clear();
      this.hashMap.clear();

      medicines.forEach(medicine => {
        const medicineWithStatus = {
          ...medicine,
          status: StatusCalculator.calculateStatus(medicine.expiry_date)
        };
        this.minHeap.insert(medicineWithStatus);
        this.hashMap.set(medicine.id, medicineWithStatus);
      });

      this.isLoaded = true;
      return medicines.length;
    } catch (error) {
      throw new Error(`Failed to load medicines: ${error.message}`);
    }
  }

  /**
   * Add new medicine to system
   * Time Complexity: O(log n) - heap insert + O(1) hashmap insert
   */
  async addMedicine(medicineData, userId = null) {
    const connection = await promisePool.getConnection();
    
    try {
      await connection.beginTransaction();

      const medicineId = uuidv4();
      const status = StatusCalculator.calculateStatus(medicineData.expiryDate);

      const medicine = {
        id: medicineId,
        ...medicineData,
        status,
        createdBy: userId
      };

      // Insert into database
      await connection.query(
        `INSERT INTO medicines (
          id, batch_number, name, category, manufacturer, description,
          quantity, unit, price, low_stock_threshold, expiry_date,
          manufacture_date, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          medicine.id,
          medicine.batchNumber,
          medicine.name,
          medicine.category,
          medicine.manufacturer,
          medicine.description || null,
          medicine.quantity,
          medicine.unit,
          medicine.price,
          medicine.lowStockThreshold,
          medicine.expiryDate,
          medicine.manufactureDate,
          medicine.status,
          medicine.createdBy
        ]
      );

      // Insert into data structures
      this.minHeap.insert(medicine);
      this.hashMap.set(medicine.id, medicine);

      // Create history entry
      await connection.query(
        `INSERT INTO history (
          id, medicine_id, user_id, action, details,
          medicine_name, batch_number, quantity_after
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          medicine.id,
          userId,
          'ADD',
          `Added medicine: ${medicine.name} (Batch: ${medicine.batchNumber})`,
          medicine.name,
          medicine.batchNumber,
          medicine.quantity
        ]
      );

      // Check if alert needed
      if (StatusCalculator.needsAlert(medicine.expiryDate)) {
        const alertSeverity = StatusCalculator.getAlertSeverity(
          StatusCalculator.getDaysUntilExpiry(medicine.expiryDate)
        );
        const daysUntilExpiry = StatusCalculator.getDaysUntilExpiry(medicine.expiryDate);
        
        let alertType = 'EXPIRING_30';
        if (daysUntilExpiry <= 1) alertType = 'EXPIRING_1';
        else if (daysUntilExpiry <= 7) alertType = 'EXPIRING_7';
        else if (daysUntilExpiry < 0) alertType = 'EXPIRED';

        await connection.query(
          `INSERT INTO alerts (
            id, medicine_id, type, severity, message, medicine_name,
            batch_number, expiry_date, days_until_expiry
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            medicine.id,
            alertType,
            alertSeverity,
            `Medicine expiring in ${daysUntilExpiry} days`,
            medicine.name,
            medicine.batchNumber,
            medicine.expiryDate,
            daysUntilExpiry
          ]
        );
      }

      await connection.commit();
      return medicine;
    } catch (error) {
      await connection.rollback();
      throw new Error(`Failed to add medicine: ${error.message}`);
    } finally {
      connection.release();
    }
  }

  /**
   * Get medicine by ID - O(1) lookup via HashMap
   */
  async getMedicineById(medicineId) {
    const medicine = this.hashMap.get(medicineId);
    
    if (!medicine) {
      // Fallback to database if not in memory
      const [rows] = await promisePool.query(
        'SELECT * FROM medicines WHERE id = ?',
        [medicineId]
      );
      
      if (rows.length === 0) return null;
      
      const dbMedicine = rows[0];
      dbMedicine.status = StatusCalculator.calculateStatus(dbMedicine.expiry_date);
      return dbMedicine;
    }

    // Update status in real-time
    medicine.status = StatusCalculator.calculateStatus(medicine.expiryDate);
    return medicine;
  }

  /**
   * Get all medicines with calculated status
   * Time Complexity: O(n)
   */
  async getAllMedicines() {
    const medicines = this.hashMap.getAllMedicines();
    
    // Update status for each medicine
    medicines.forEach(medicine => {
      medicine.status = StatusCalculator.calculateStatus(medicine.expiryDate);
    });

    // Calculate stats
    const stats = {
      safe: medicines.filter(m => m.status === 'Safe').length,
      expiringSoon: medicines.filter(m => m.status === 'Expiring Soon').length,
      critical: medicines.filter(m => m.status === 'Critical').length,
      expired: medicines.filter(m => m.status === 'Expired').length
    };

    return {
      medicines,
      total: medicines.length,
      stats
    };
  }

  /**
   * Update medicine
   * Time Complexity: O(n) - heap update + O(1) hashmap update
   */
  async updateMedicine(medicineId, updates, userId = null) {
    const connection = await promisePool.getConnection();
    
    try {
      await connection.beginTransaction();

      const oldMedicine = await this.getMedicineById(medicineId);
      if (!oldMedicine) {
        throw new Error('Medicine not found');
      }

      // Calculate new status if expiry date changed
      const status = updates.expiryDate
        ? StatusCalculator.calculateStatus(updates.expiryDate)
        : oldMedicine.status;

      const updatedMedicine = {
        ...oldMedicine,
        ...updates,
        status
      };

      // Update database
      const updateFields = [];
      const updateValues = [];
      
      Object.keys(updates).forEach(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateFields.push(`${dbKey} = ?`);
        updateValues.push(updates[key]);
      });

      updateFields.push('status = ?');
      updateValues.push(status);
      updateValues.push(medicineId);

      await connection.query(
        `UPDATE medicines SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Update data structures
      this.minHeap.update(medicineId, updatedMedicine);
      this.hashMap.set(medicineId, updatedMedicine);

      // Create history entry
      await connection.query(
        `INSERT INTO history (
          id, medicine_id, user_id, action, details, medicine_name,
          batch_number, changes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          medicineId,
          userId,
          'UPDATE',
          `Updated medicine: ${updatedMedicine.name}`,
          updatedMedicine.name,
          updatedMedicine.batchNumber,
          JSON.stringify({ before: oldMedicine, after: updates })
        ]
      );

      await connection.commit();
      return updatedMedicine;
    } catch (error) {
      await connection.rollback();
      throw new Error(`Failed to update medicine: ${error.message}`);
    } finally {
      connection.release();
    }
  }

  /**
   * Delete medicine
   * Time Complexity: O(n) - heap remove + O(1) hashmap delete
   */
  async deleteMedicine(medicineId, userId = null) {
    const connection = await promisePool.getConnection();
    
    try {
      await connection.beginTransaction();

      const medicine = await this.getMedicineById(medicineId);
      if (!medicine) {
        throw new Error('Medicine not found');
      }

      // Delete from database (cascades to alerts)
      await connection.query('DELETE FROM medicines WHERE id = ?', [medicineId]);

      // Remove from data structures
      this.minHeap.remove(medicineId);
      this.hashMap.delete(medicineId);

      // Create history entry
      await connection.query(
        `INSERT INTO history (
          id, medicine_id, user_id, action, details, medicine_name, batch_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          medicineId,
          userId,
          'DELETE',
          `Deleted medicine: ${medicine.name} (Batch: ${medicine.batchNumber})`,
          medicine.name,
          medicine.batchNumber
        ]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error(`Failed to delete medicine: ${error.message}`);
    } finally {
      connection.release();
    }
  }

  /**
   * Search medicines by name - O(n) but fast due to HashMap iteration
   */
  searchByName(name) {
    return this.hashMap.searchByName(name);
  }

  /**
   * Search by batch number - O(1) average case
   */
  searchByBatch(batchNumber) {
    return this.hashMap.searchByBatch(batchNumber);
  }

  /**
   * Search by category - O(n)
   */
  searchByCategory(category) {
    return this.hashMap.searchByCategory(category);
  }

  /**
   * Get FEFO recommendations - Uses MinHeap for O(n log n) efficiency
   */
  getFEFORecommendations(limit = 10) {
    return this.minHeap.getTopNExpiring(limit);
  }

  /**
   * Get medicines expiring within days - O(n) filtering
   */
  getMedicinesExpiringWithin(days) {
    return this.minHeap.getMedicinesExpiringWithin(days);
  }

  /**
   * Dispense medicine (reduce quantity)
   */
  async dispenseMedicine(medicineId, quantity, notes = '', userId = null) {
    const connection = await promisePool.getConnection();
    
    try {
      await connection.beginTransaction();

      const medicine = await this.getMedicineById(medicineId);
      if (!medicine) {
        throw new Error('Medicine not found');
      }

      if (medicine.quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      const newQuantity = medicine.quantity - quantity;

      // Update database
      await connection.query(
        'UPDATE medicines SET quantity = ? WHERE id = ?',
        [newQuantity, medicineId]
      );

      // Update data structures
      const updatedMedicine = { ...medicine, quantity: newQuantity };
      this.minHeap.update(medicineId, updatedMedicine);
      this.hashMap.set(medicineId, updatedMedicine);

      // Create history entry
      await connection.query(
        `INSERT INTO history (
          id, medicine_id, user_id, action, details, medicine_name,
          batch_number, quantity_before, quantity_after
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          medicineId,
          userId,
          'DISPENSE',
          `Dispensed ${quantity} units. ${notes}`,
          medicine.name,
          medicine.batchNumber,
          medicine.quantity,
          newQuantity
        ]
      );

      // Check for low stock alert
      if (newQuantity <= medicine.lowStockThreshold) {
        await connection.query(
          `INSERT INTO alerts (
            id, medicine_id, type, severity, message, medicine_name,
            batch_number, expiry_date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            medicineId,
            'LOW_STOCK',
            'warning',
            `Low stock: Only ${newQuantity} units remaining`,
            medicine.name,
            medicine.batchNumber,
            medicine.expiryDate
          ]
        );
      }

      await connection.commit();
      return updatedMedicine;
    } catch (error) {
      await connection.rollback();
      throw new Error(`Failed to dispense medicine: ${error.message}`);
    } finally {
      connection.release();
    }
  }
}

export default new MedicineService();
