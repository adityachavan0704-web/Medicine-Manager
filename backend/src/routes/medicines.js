const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { validate, medicineSchema, dispenseSchema } = require('../middleware/validation');

// Public routes (require authentication)
router.use(verifyToken);

// Get all medicines
router.get('/', medicineController.getAllMedicines);

// Search medicines
router.get('/search', medicineController.searchMedicines);

// Get expiring medicines
router.get('/expiring', medicineController.getExpiringMedicines);

// Get medicine by ID
router.get('/:id', medicineController.getMedicineById);

// Add medicine (admin, pharmacist)
router.post(
  '/',
  requireRole('admin', 'pharmacist'),
  validate(medicineSchema),
  medicineController.addMedicine
);

// Update medicine (admin, pharmacist)
router.put(
  '/:id',
  requireRole('admin', 'pharmacist'),
  medicineController.updateMedicine
);

// Delete medicine (admin only)
router.delete(
  '/:id',
  requireRole('admin'),
  medicineController.deleteMedicine
);

// Dispense medicine (admin, pharmacist)
router.post(
  '/:id/dispense',
  requireRole('admin', 'pharmacist'),
  validate(dispenseSchema),
  medicineController.dispenseMedicine
);

module.exports = router;
