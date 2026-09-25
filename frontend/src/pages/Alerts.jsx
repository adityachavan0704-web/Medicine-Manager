import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Trash2, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { alertAPI } from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, activeTab]);

  const loadAlerts = async () => {
    try {
      const response = await alertAPI.getAll();
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (activeTab === 'unread') {
      filtered = alerts.filter(a => !a.isRead);
    } else if (activeTab === 'critical') {
      filtered = alerts.filter(a => a.severity === 'critical');
    } else if (activeTab === 'warning') {
      filtered = alerts.filter(a => a.severity === 'warning');
    } else if (activeTab === 'info') {
      filtered = alerts.filter(a => a.severity === 'info');
    }

    setFilteredAlerts(filtered);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await alertAPI.markAsRead(id);
      loadAlerts();
    } catch (error) {
      alert('Failed to mark as read');
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await alertAPI.acknowledge(id);
      loadAlerts();
    } catch (error) {
      alert('Failed to acknowledge alert');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      await alertAPI.delete(id);
      loadAlerts();
    } catch (error) {
      alert('Failed to delete alert');
    }
  };

  const handleGenerateAlerts = async () => {
    if (!confirm('Generate new alerts based on current medicine expiry dates?')) return;

    try {
      await alertAPI.generate();
      loadAlerts();
      alert('Alerts generated successfully');
    } catch (error) {
      alert('Failed to generate alerts');
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: alerts.length },
    { id: 'unread', label: 'Unread', count: alerts.filter(a => !a.isRead).length },
    { id: 'critical', label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length },
    { id: 'warning', label: 'Warnings', count: alerts.filter(a => a.severity === 'warning').length },
    { id: 'info', label: 'Info', count: alerts.filter(a => a.severity === 'info').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alert Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage medicine expiry and stock alerts</p>
        </div>
        <button
          onClick={handleGenerateAlerts}
          className="btn-primary inline-flex items-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Generate Alerts
        </button>
      </div>

      {/* Tabs */}
      <div className="card p-0">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-medical-600 text-medical-600 dark:text-medical-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.label}
                <span className={`
                  ml-2 py-0.5 px-2 rounded-full text-xs
                  ${activeTab === tab.id
                    ? 'bg-medical-100 text-medical-600 dark:bg-medical-900/30 dark:text-medical-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }
                `}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No alerts found</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-6 ${getSeverityColor(alert.severity)} ${
                  !alert.isRead ? 'font-medium' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg text-gray-900 dark:text-white">
                          {alert.medicineName}
                        </h3>
                        {!alert.isRead && (
                          <span className="px-2 py-1 text-xs rounded-full bg-medical-600 text-white">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Batch: {alert.batchNumber}</span>
                        <span>•</span>
                        <span>
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                        {alert.isAcknowledged && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 dark:text-green-400">
                              Acknowledged
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {!alert.isAcknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-1 text-sm bg-medical-600 hover:bg-medical-700 text-white rounded-lg transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
