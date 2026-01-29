import React, { useState, useEffect, useCallback } from 'react';
import { RiFileTextLine, RiUserLine, RiCheckLine, RiTimeLine } from 'react-icons/ri';
import contractsApi from '../../../services/contractsApi';

const renderIcon = (iconName) => {
  const iconClass = "w-5 h-5 text-orange-500";
  switch (iconName) {
    case 'ri-file-text-line': return <RiFileTextLine className={iconClass} />;
    case 'ri-user-line': return <RiUserLine className={iconClass} />;
    case 'ri-check-line': return <RiCheckLine className={iconClass} />;
    case 'ri-time-line': return <RiTimeLine className={iconClass} />;
    default: return <RiFileTextLine className={iconClass} />;
  }
};

function RecentActivity({ autoRefreshMs = 30000 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecentActivity = useCallback(async () => { try { const data = await contractsApi.getEnterpriseRecentActivity(); setActivities(data); } catch (error) { console.error('Erreur:', error); setActivities([{ icon: 'ri-file-text-line', message: "Nouveau contrat signe avec l'artisan Alpha Renovation", date: "Aujourd'hui - 09:42" }, { icon: 'ri-user-line', message: "Candidature recue pour l'appel d'offres #BTP-2025-045", date: "Hier - 18:27" }, { icon: 'ri-check-line', message: "Mission 'Isolation thermique' marquee comme terminee", date: "14 juillet - 15:10" }, { icon: 'ri-time-line', message: "Echeance de paiement dans 3 jours pour le lot #232-A", date: "13 juillet - 11:05" }]); } finally { setLoading(false); } }, []);

  useEffect(() => { loadRecentActivity(); }, [loadRecentActivity]);
  useEffect(() => { if (!autoRefreshMs || autoRefreshMs < 1000) return; const id = setInterval(loadRecentActivity, autoRefreshMs); return () => clearInterval(id); }, [autoRefreshMs, loadRecentActivity]);

  if (loading) return (<div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-6 rounded-xl border shadow-sm h-full animate-pulse"><div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>{[1,2,3,4].map((index) => (<div key={index} className="flex items-start space-x-3 mb-4"><div className="w-5 h-5 bg-gray-200 rounded-full mt-1"></div><div><div className="h-4 bg-gray-200 rounded w-64 mb-2"></div><div className="h-3 bg-gray-200 rounded w-24"></div></div></div>))}</div>);

  return (<div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-6 rounded-xl border shadow-sm h-full"><h2 className="text-lg font-semibold text-white mb-4">Activite recente</h2><ul className="space-y-4">{activities.map((activity, index) => (<li key={index} className="flex items-start space-x-3"><div className="mt-1">{renderIcon(activity.icon)}</div><div><p className="text-sm text-white">{activity.message}</p><p className="text-xs text-white">{activity.date}</p></div></li>))}</ul></div>);
}

export default RecentActivity;
