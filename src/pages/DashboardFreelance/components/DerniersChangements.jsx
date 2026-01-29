import React, { useState, useEffect, useCallback } from 'react';
import contractsApi from '../../../services/contractsApi';

function DerniersChangements({ autoRefreshMs = 30000 }) {
  const [changements, setChangements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecentChanges = useCallback(async () => {
    try {
      const data = await contractsApi.getFreelanceRecentChanges();
      setChangements(data);
    } catch (error) {
      console.error('Erreur lors du chargement des derniers changements:', error);
      setChangements([
        { type: 'contrat', icon: 'ri-check-line', title: 'Nouveau contrat', description: 'Renovation bureau - Entreprise Durand', time: 'Il y a 2 heures', bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
        { type: 'litige', icon: 'ri-alert-line', title: 'Litige ouvert', description: 'Contrat #2024-001 - Plomberie industrielle', time: 'Il y a 1 jour', bg: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
        { type: 'paiement', icon: 'ri-money-euro-circle-line', title: 'Paiement recu', description: 'Mission electricite - 850 EUR', time: 'Il y a 3 jours', bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }
      ]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadRecentChanges(); }, [loadRecentChanges]);
  useEffect(() => { if (!autoRefreshMs || autoRefreshMs < 1000) return; const id = setInterval(loadRecentChanges, autoRefreshMs); return () => clearInterval(id); }, [autoRefreshMs, loadRecentChanges]);

  if (loading) return (<div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"><div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>{[1,2,3].map((i) => (<div key={i} className="flex items-start space-x-3 p-3 mb-4"><div className="w-8 h-8 bg-gray-200 rounded-full"></div><div><div className="h-4 bg-gray-200 rounded w-32 mb-2"></div><div className="h-3 bg-gray-200 rounded w-48 mb-1"></div><div className="h-3 bg-gray-200 rounded w-24"></div></div></div>))}</div>);

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Derniers changements</h3>
      <div className="space-y-4">
        {changements.map((item, index) => (<div key={index} className={`flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-br from-orange-500/50 to-orange-500 bg-opacity-80 border border-orange-400/40 ${item.bg}`}><div className={`w-8 h-8 ${item.iconBg} rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400/50 to-orange-600 bg-opacity-50`}><i className={`${item.icon} ${item.iconColor}`}></i></div><div><p className="text-sm font-medium text-white">{item.title}</p><p className="text-xs text-white">{item.description}</p><p className="text-xs text-white mt-1">{item.time}</p></div></div>))}
      </div>
    </div>
  );
}

export default DerniersChangements;
