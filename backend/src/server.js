require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const alertRoutes = require('./routes/alerts');
const analyticsRoutes = require('./routes/analytics');
const dsVisualizationRoutes = require('./routes/dsVisualization');

// Import services for initialization
const medicineService = require('./services/MedicineService');
const alertService = require('./services/AlertService');
const historyService = require('./services/HistoryService');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ds', dsVisualizationRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Initialize services and start server
const startServer = async () => {
  try {
    console.log('Initializing services...');
    
    // Initialize medicine service (loads data into data structures)
    await medicineService.initialize();
    console.log('✓ MedicineService initialized');

    // Initialize alert service
    await alertService.initialize();
    console.log('✓ AlertService initialized');

    // Initialize history service
    await historyService.initialize();
    console.log('✓ HistoryService initialized');

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 SmartMedGuard Backend Server running on port ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
      console.log(`   API Base: http://localhost:${PORT}/api`);
      console.log(`\n📊 Data Structures Loaded:`);
      console.log(`   - MinHeap: ${medicineService.minHeap.size()} medicines`);
      console.log(`   - HashMap: ${medicineService.medicineMap.size()} medicines`);
      console.log(`   - AlertQueue: ${alertService.alertQueue.size()} alerts`);
      console.log(`   - HistoryLinkedList: ${historyService.historyList.size()} entries`);
      console.log(`\n✨ Server ready to accept connections!\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
