import React, { useState, useEffect, useCallback } from 'react';
import { RiBuilding2Line, RiUserLine, RiFileCopyLine, RiMoneyEuroCircleLine } from 'react-icons/ri';
import contractsApi from '../../../services/contractsApi';

function StatCards({ autoRefreshMs = 30000 }) {
  const [stats, setStats] = useState([{ label: 'Chantiers en cours', value: 0, icon: <RiBuilding2Line className="text-2xl text-primary" /> }, { label: 'Freelances actifs', value: 0, icon: <RiUserLine className="text-2xl text-green-600" /> }, { label: 'Appels d\'offres', value: 0, icon: <RiFileCopyLine className="text-2xl text-yellow-600" /> }, { label: 'Budget total', value: '\u20ac0', icon: <RiMoneyEuroCircleLine className="text-2xl text-indigo-600" /> }]);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => { try { const data = await contractsApi.getEnterpriseDashboardStats(); setStats([{ label: 'Chantiers en cours', value: data.chantiersEnCours, icon: <RiBuilding2Line className="text-2xl text-primary" /> }, { label: 'Auto-entrepreneurs actifs', value: data.freelancesActifs, icon: <RiUserLine className="text-2xl text-green-600" /> }, { label: 'Appels d\'offres', value: data.appelsOffres, icon: <RiFileCopyLine className="text-2xl text-yellow-600" /> }, { label: 'Budget total', value: data.budgetTotal, icon: <RiMoneyEuroCircleLine className="text-2xl text-indigo-600" /> }]); } catch (error) { console.error('Erreur:', error); } finally { setLoading(false); } }, []);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { if (!autoRefreshMs || autoRefreshMs < 1000) return; const id = setInterval(loadStats, autoRefreshMs); return () => clearInterval(id); }, [autoRefreshMs, loadStats]);

  if (loading) return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[1,2,3,4].map((index) => (<div key={index} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 border border-gray-200 rounded-lg p-4 flex items-center shadow-sm animate-pulse"><div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div><div><div className="h-4 bg-gray-200 rounded w-24 mb-2"></div><div className="h-6 bg-gray-200 rounded w-16"></div></div></div>))}</div>);

  return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{stats.map((stat, index) => (<div key={index} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 border border-gray-200 rounded-lg p-4 flex items-center shadow-sm"><div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">{stat.icon}</div><div><p className="text-sm text-white">{stat.label}</p><p className="text-xl font-bold text-white">{stat.value}</p></div></div>))}</div>);
}

export default StatCards;
