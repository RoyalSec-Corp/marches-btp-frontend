import React, { useState, useEffect, useCallback } from 'react';
import { RiBriefcaseFill, RiFileTextFill, RiWalletFill, RiCalendarFill } from 'react-icons/ri';
import contractsApi from '../../../services/contractsApi';

function StatCards({ autoRefreshMs = 30000 }) {
  const [stats, setStats] = useState([
    { label: 'Missions en cours', value: 0, icon: <RiBriefcaseFill className="text-blue-600 text-xl" />, bg: 'bg-blue-100' },
    { label: 'Contrats signes', value: 0, icon: <RiFileTextFill className="text-green-600 text-xl" />, bg: 'bg-green-100' },
    { label: 'Solde disponible', value: '0 €', icon: <RiWalletFill className="text-yellow-600 text-xl" />, bg: 'bg-yellow-100' },
    { label: 'Prochain paiement', value: '15 Jan', icon: <RiCalendarFill className="text-purple-600 text-xl" />, bg: 'bg-purple-100' }
  ]);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await contractsApi.getFreelanceDashboardStats();
      setStats([
        { label: 'Missions en cours', value: data.missionsEnCours, icon: <RiBriefcaseFill className="text-blue-600 text-xl" />, bg: 'bg-blue-100' },
        { label: 'Contrats signes', value: data.contratsSignes, icon: <RiFileTextFill className="text-green-600 text-xl" />, bg: 'bg-green-100' },
        { label: 'Solde disponible', value: data.soldeDisponible, icon: <RiWalletFill className="text-yellow-600 text-xl" />, bg: 'bg-yellow-100' },
        { label: 'Prochain paiement', value: data.prochainPaiement, icon: <RiCalendarFill className="text-purple-600 text-xl" />, bg: 'bg-purple-100' }
      ]);
    } catch (error) { console.error('Erreur lors du chargement des statistiques:', error); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { if (!autoRefreshMs || autoRefreshMs < 1000) return; const id = setInterval(loadStats, autoRefreshMs); return () => clearInterval(id); }, [autoRefreshMs, loadStats]);

  if (loading) return (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">{[1,2,3,4].map((index) => (<div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"><div className="flex items-center"><div className="w-12 h-12 rounded-lg bg-gray-200"></div><div className="ml-4"><div className="h-4 bg-gray-200 rounded w-24 mb-2"></div><div className="h-6 bg-gray-200 rounded w-16"></div></div></div></div>))}</div>);

  return (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">{stats.map((stat, index) => (<div key={index} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg shadow-sm border border-gray-200 p-6"><div className="flex items-center"><div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>{stat.icon}</div><div className="ml-4"><p className="text-sm font-medium text-white">{stat.label}</p><p className="text-2xl font-bold text-white">{stat.value}</p></div></div></div>))}</div>);
}

export default StatCards;
