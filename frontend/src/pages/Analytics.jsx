import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Package, AlertTriangle } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [dashboard, trends] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getTrends(),
      ]);
      setDashboardData(dashboard.data);
      setTrendsData(trends.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  if (!dashboardData || !trendsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Failed to load analytics data</p>
      </div>
    );
  }

  const categoryData = Object.entries(dashboardData.categoryBreakdown || {}).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Insights and trends for your medicine inventory</p>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Medicine by Category</h2>
          <BarChart3 className="w-6 h-6 text-medical-600 dark:text-medical-400" />
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="count" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expiry Trends */}
      {trendsData.expiryTrend && trendsData.expiryTrend.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Expiry Trends</h2>
            <TrendingUp className="w-6 h-6 text-medical-600 dark:text-medical-400" />
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendsData.expiryTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="expired" stroke="#ef4444" name="Expired" />
              <Line type="monotone" dataKey="expiring" stroke="#f59e0b" name="Expiring" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stock Trends */}
      {trendsData.stockTrend && trendsData.stockTrend.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Stock Movement</h2>
            <Package className="w-6 h-6 text-medical-600 dark:text-medical-400" />
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trendsData.stockTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="added" stackId="1" stroke="#22c55e" fill="#22c55e" name="Added" />
              <Area type="monotone" dataKey="dispensed" stackId="2" stroke="#3b82f6" fill="#3b82f6" name="Dispensed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Low Stock Alert Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h2>
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        {dashboardData.lowStock && dashboardData.lowStock.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Threshold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.lowStock.map((medicine) => (
                  <tr key={medicine.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {medicine.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {medicine.batchNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {medicine.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {medicine.quantity} {medicine.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {medicine.lowStockThreshold} {medicine.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        Low Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No low stock items at the moment
          </p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
