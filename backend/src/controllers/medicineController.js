const medicineService = require('../services/MedicineService');

/**
 * Get all medicines
 */
const getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await medicineService.getAllMedicines();
    const stats = await medicineService.getStatusStats();

    res.json({
      medicines,
      total: medicines.length,
      stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get medicine by ID
 */
const getMedicineById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await medicineService.getMedicineById(id);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    // Get related alerts and history
    const AlertService = require('../services/AlertService');
    const HistoryService = require('../services/HistoryService');

    const [alerts, history] = await Promise.all([
      AlertService.getAlerts({ medicineId: id }),
      HistoryService.getHistoryByMedicineId(id)
    ]);

    res.json({
      medicine,
      alerts,
      history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add new medicine
 */
const addMedicine = async (req, res, next) => {
  try {
    const medicine = await medicineService.addMedicine(
      req.validatedBody,
      req.user.id
    );

    res.status(201).json(medicine);
  } catch (error) {
    next(error);
  }
};

/**
 * Update medicine
 */
const updateMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await medicineService.updateMedicine(
      id,
      req.body,
      req.user.id
    );

    res.json(medicine);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete medicine
 */
const deleteMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    await medicineService.deleteMedicine(id, req.user.id);

    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Search medicines
 */
const searchMedicines = async (req, res, next) => {
  try {
    const { q, category, batch } = req.query;
    let results = [];

    if (q) {
      results = medicineService.searchByName(q);
    } else if (category) {
      results = medicineService.searchByCategory(category);
    } else if (batch) {
      const medicine = medicineService.searchByBatch(batch);
      results = medicine ? [medicine] : [];
    } else {
      results = await medicineService.getAllMedicines();
    }

    res.json({ medicines: results, searchTerm: q || category || batch });
  } catch (error) {
    next(error);
  }
};

/**
 * Get expiring medicines and FEFO recommendations
 */
const getExpiringMedicines = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const expiring = medicineService.getMedicinesExpiringWithin(parseInt(days));
    const fefo = medicineService.getFEFORecommendations(10);

    res.json({
      medicines: expiring,
      fefoRecommendations: fefo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Dispense medicine
 */
const dispenseMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, notes } = req.validatedBody;

    const result = await medicineService.dispenseMedicine(
      id,
      quantity,
      req.user.id,
      notes
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
  getExpiringMedicines,
  dispenseMedicine
};
