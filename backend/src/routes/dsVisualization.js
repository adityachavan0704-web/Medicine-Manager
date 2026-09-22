const express = require('express');
const router = express.Router();
const dsVisualizationController = require('../controllers/dsVisualizationController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Get MinHeap visualization
router.get('/minheap', dsVisualizationController.getMinHeapVisualization);

// Get HashMap visualization
router.get('/hashmap', dsVisualizationController.getHashMapVisualization);

// Get Queue visualization
router.get('/queue', dsVisualizationController.getQueueVisualization);

// Get LinkedList visualization
router.get('/linkedlist', dsVisualizationController.getLinkedListVisualization);

module.exports = router;
