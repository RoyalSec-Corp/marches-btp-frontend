import React, { useState, useEffect } from 'react';
import { RiNotificationLine, RiCheckLine, RiDeleteBinLine, RiEyeLine, RiTimeLine, RiUserLine, RiFileTextLine } from 'react-icons/ri';
import notificationsApi from '../../../services/notificationsApi';

function NotificationsEntreprise() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => { try { setLoading(true); const data = await notificationsApi.getNotifications(); setNotifications(Array.isArray(data) ? data : []); } catch (error) { console.error('Erreur:', error); setNotifications([]); } finally { setLoading(false); } };

  const markAsRead = async (notificationId) => { try { await notificationsApi.markAsRead(notificationId); setNotifications(prev => prev.map(notif => notif.id === notificationId ? { ...notif, lu: true } : notif)); } catch (error) { console.error('Erreur:', error); } };

  const markAllAsRead = async () => { try { await notificationsApi.markAllAsRead(); setNotifications(prev => prev.map(notif => ({ ...notif, lu: true }))); } catch (error) { console.error('Erreur:', error); } };

  const getNotificationIcon = (type) => { switch (type) { case 'new_application': return <RiUserLine className="w-5 h-5 text-orange-500" />; case 'direct_contract_accepted': case 'direct_contract_declined': return <RiFileTextLine className="w-5 h-5 text-orange-500" />; case 'contract_started': case 'contract_completed': return <RiCheckLine className="w-5 h-5 text-orange-500" />; default: return <RiNotificationLine className="w-5 h-5 text-orange-500" />; } };

  const formatDate = (dateString) => { const date = new Date(dateString); const now = new Date(); const diffInHours = Math.floor((now - date) / (1000 * 60 * 60)); if (diffInHours < 1) return 'A l\'instant'; if (diffInHours < 24) return `Il y a ${diffInHours}h`; if (diffInHours < 48) return 'Hier'; return date.toLocaleDateString('fr-FR'); };

  const filteredNotifications = notifications.filter(notif => { if (filter === 'unread') return !notif.lu; if (filter === 'read') return notif.lu; return true; });
  const unreadCount = notifications.filter(n => !n.lu).length;

  if (loading) return (<div className="space-y-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800">Notifications</h2></div><div className="bg-white rounded-lg border p-6"><div className="animate-pulse space-y-4">{[1, 2, 3].map(i => (<div key={i} className="flex space-x-4"><div className="w-10 h-10 bg-gray-200 rounded-full"></div><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div></div>))}</div></div></div>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-white">Notifications</h2><p className="text-sm text-white">{unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes les notifications sont lues'}</p></div>{unreadCount > 0 && (<button onClick={markAllAsRead} className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"><RiCheckLine className="w-4 h-4 mr-2" />Tout marquer comme lu</button>)}</div>
      <div className="flex space-x-2">{[{ key: 'all', label: 'Toutes', count: notifications.length, color: 'blue' }, { key: 'unread', label: 'Non lues', count: unreadCount, color: 'orange' }, { key: 'read', label: 'Lues', count: notifications.length - unreadCount, color: 'green' }].map(({ key, label, count, color }) => { const isActive = filter === key; let buttonClass = ''; if (color === 'blue') { buttonClass = isActive ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white' : 'bg-blue-50 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 hover:text-white'; } else if (color === 'orange') { buttonClass = isActive ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' : 'bg-orange-50 text-orange-600 hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600 hover:text-white'; } else if (color === 'green') { buttonClass = isActive ? 'bg-gradient-to-r from-blue-500/30 via-blue-600/30 to-blue-700/30 text-white border border-blue-400/40 backdrop-blur-sm' : 'bg-white/20 text-white border border-white/30 backdrop-blur-sm hover:bg-white/30'; } return (<button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${buttonClass}`}>{label} ({count})</button>); })}</div>
      <div className="bg-white rounded-lg border">{filteredNotifications.length === 0 ? (<div className="p-8 text-center"><RiNotificationLine className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">{filter === 'unread' ? 'Aucune notification non lue' : filter === 'read' ? 'Aucune notification lue' : 'Aucune notification'}</h3><p className="text-gray-500">{filter === 'all' ? 'Vous recevrez ici toutes vos notifications importantes.' : ''}</p></div>) : (<div className="divide-y divide-gray-100">{filteredNotifications.map((notification) => (<div key={notification.id} className={`p-4 border-l-4 transition-colors ${!notification.lu ? 'border-l-blue-700 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-500 text-white' : 'border-l-gray-200 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-400 text-white hover:bg-gray-50'}`}><div className="flex items-start space-x-3"><div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type_notification)}</div><div className="flex-1 min-w-0"><div className="flex items-start justify-between"><div className="flex-1"><h4 className={`text-sm font-medium ${!notification.lu ? 'text-white' : 'text-white'}`}>{notification.titre || 'Notification'}</h4><p className={`mt-1 text-sm ${!notification.lu ? 'text-white' : 'text-white'}`}>{notification.message}</p><div className="flex items-center mt-2 text-xs text-white"><RiTimeLine className="w-3 h-3 mr-1" />{formatDate(notification.date_envoi)}</div></div><div className="flex items-center space-x-2 ml-4">{!notification.lu && (<button onClick={() => markAsRead(notification.id)} className="p-1 text-orange-400 hover:text-orange-600 transition-colors" title="Marquer comme lu"><RiEyeLine className="w-4 h-4" /></button>)}{!notification.lu && (<div className="w-2 h-2 bg-orange-500 rounded-full"></div>)}</div></div></div></div></div>))}</div>)}</div>
    </div>
  );
}

export default NotificationsEntreprise;
