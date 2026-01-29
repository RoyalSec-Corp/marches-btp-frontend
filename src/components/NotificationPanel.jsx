import React, { useState, useEffect } from 'react';
import './NotificationPanel.css';

/**
 * Panneau de notifications
 */
const NotificationPanel = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
  loading = false,
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    const icons = {
      CONTRAT: '📄',
      MESSAGE: '💬',
      APPEL_OFFRE: '📢',
      CANDIDATURE: '👤',
      PAIEMENT: '💰',
      LITIGE: '⚠️',
      SYSTEME: '🔔',
    };
    return icons[type] || '🔔';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "A l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h3>
          Notifications
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h3>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="panel-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Non lues ({unreadCount})
        </button>
        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={onMarkAllAsRead}>
            Tout marquer lu
          </button>
        )}
      </div>

      <div className="panel-content">
        {loading ? (
          <div className="panel-loading">
            <span className="loader"></span>
            <p>Chargement...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="panel-empty">
            <span className="empty-icon">🔔</span>
            <p>Aucune notification</p>
          </div>
        ) : (
          <ul className="notification-list">
            {filteredNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
              >
                <span className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="notification-content">
                  <p className="notification-title">{notification.titre}</p>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                {!notification.read && <span className="unread-dot" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
