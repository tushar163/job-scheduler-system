import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, Bell, Webhook, CheckCircle, XCircle, Clock } from 'lucide-react';
import { GETService } from '@/service/CommanService';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch webhook notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await GETService({ endpoint: 'api/v1/jobs/get-logs' });
        if (response.success && response.data) {
          const transformedNotifications = response.data.map(item => ({
            id: item.id,
            jobId: item.jobId,
            taskName: item.requestBody?.taskName || 'Unknown Task',
            priority: item.requestBody?.priority || 'UNKNOWN',
            responseStatus: item.responseStatus,
            responseBody: item.responseBody,
            sentAt: new Date(item.sentAt),
            status: item.responseStatus === 200 ? 'completed' : 
                   item.responseStatus === null ? 'pending' : 'failed',
            read: false
          }));
          
          setNotifications(transformedNotifications);
          const unread = transformedNotifications.filter(notif => !notif.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000); 
    
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getStatusIcon = (status, responseStatus) => {
    if (responseStatus === 200) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (responseStatus === null) {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status, responseStatus) => {
    if (responseStatus === 200) {
      return 'bg-green-100 text-green-800';
    } else if (responseStatus === null) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (responseStatus) => {
    if (responseStatus === 200) {
      return 'Delivered';
    } else if (responseStatus === null) {
      return 'Pending';
    } else {
      return 'Failed';
    }
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return 'No response body';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-white shadow-sm z-10 ">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <h1 className="text-xl font-semibold text-gray-800">Job Manager</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Webhook Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Bell className="w-6 h-6 text-gray-600 group-hover:text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Webhook Logs</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <Webhook className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No webhook logs</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getStatusIcon(notification.status, notification.responseStatus)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-gray-900 text-sm">
                                  {notification.taskName}
                                </p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status, notification.responseStatus)}`}>
                                  {getStatusText(notification.responseStatus)}
                                </span>
                              </div>
                              
                              <div className="space-y-1 mb-2">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Job ID: {notification.jobId}</span>
                                  <span>Priority: {notification.priority}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Status: {notification.responseStatus || 'Pending'}</span>
                                  <span className="flex items-center space-x-1">
                                    <span>{formatDate(notification.sentAt)}</span>
                                    <span>{formatTime(notification.sentAt)}</span>
                                  </span>
                                </div>
                              </div>

                              {notification.responseBody && (
                                <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                                  <p className="text-gray-600 whitespace-pre-wrap">
                                    {truncateText(notification.responseBody)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Mark as read"
                              >
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </button>
                            )}
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title="Dismiss"
                            >
                              <X className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button
                      onClick={clearAllNotifications}
                      className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-1"
                    >
                      Clear all logs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

         
        </div>
      </div>

      {/* Overlay for closing notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default Header;