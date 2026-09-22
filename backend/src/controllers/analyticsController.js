const db = require('../config/database');
const medicineService = require('../services/MedicineService');
const alertService = require('../services/AlertService');
const historyService = require('../services/HistoryService');

/**
 * Get dashboard analytics
 */
const getDashboardAnalytics = async (req, res, next) => {
  try {
    // Get medicines and stats
    const medicines = await medicineService.getAllMedicines();
    const stats = await medicineService.getStatusStats();
    const alertStats = await alertService.getAlertStats();

    // Calculate total value
    const totalValue = medicines.reduce((sum, m) => sum + (m.quantity * m.price), 0);

    // Get category breakdown
    const categoryBreakdown = {};
    medicines.forEach(m => {
      categoryBreakdown[m.category] = (categoryBreakdown[m.category] || 0) + 1;
    });

    // Get expiry timeline (next 30 days)
    const expiryTimeline = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = medicines.filter(m => {
        const expiryStr = new Date(m.expiryDate).toISOString().split('T')[0];
        return expiryStr === dateStr;
      }).length;

      if (count > 0) {
        expiryTimeline.push({ date: dateStr, count });
      }
    }

    // Get recent activity
    const recentActivity = historyService.getRecentHistory(10);

    // Get top expiring (FEFO)
    const topExpiring = medicineService.getFEFORecommendations(10);

    // Get low stock
    const lowStock = medicines.filter(m => m.quantity <= m.lowStockThreshold);

    res.json({
      totalMedicines: medicines.length,
      totalValue: parseFloat(totalValue.toFixed(2)),
      statusBreakdown: {
        safe: stats.safe,
        expiringSoon: stats.expiringSoon,
        critical: stats.critical,
        expired: stats.expired
      },
      categoryBreakdown,
      expiryTimeline,
      recentActivity,
      topExpiring,
      lowStock,
      alertStats: {
        unread: alertStats.unread,
        critical: alertStats.critical
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get trend analytics
 */
const getTrendAnalytics = async (req, res, next) => {
  try {
    // Get monthly trends for last 6 months
    const [expiryTrend] = await db.query(`
      SELECT 
        DATE_FORMAT(expiry_date, '%Y-%m') as month,
        SUM(CASE WHEN status = 'Expired' THEN 1 ELSE 0 END) as expired,
        SUM(CASE WHEN status IN ('Expiring Soon', 'Critical') THEN 1 ELSE 0 END) as expiring
      FROM medicines
      WHERE expiry_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month
    `);

    const [stockTrend] = await db.query(`
      SELECT 
        DATE_FORMAT(timestamp, '%Y-%m') as month,
        SUM(CASE WHEN action = 'ADD' THEN 1 ELSE 0 END) as added,
        SUM(CASE WHEN action = 'DISPENSE' THEN 1 ELSE 0 END) as dispensed
      FROM history
      WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month
    `);

    res.json({
      expiryTrend,
      stockTrend
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
  getTrendAnalytics
};
