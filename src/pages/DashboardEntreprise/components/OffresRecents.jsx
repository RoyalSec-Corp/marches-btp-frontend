import React, { useState, useEffect, useCallback } from 'react';
import { RiFileList3Line } from 'react-icons/ri';
import contractsApi from '../../../services/contractsApi';

function OffresRecents({ autoRefreshMs = 30000 }) {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecentOffers = useCallback(async () => { try { const data = await contractsApi.getEnterpriseRecentOffers(); setOffres(data); } catch (error) { console.error('Erreur:', error); setOffres([{ id: 1, titre: "Renovation d'une ecole a Lyon", entreprise: "BTP Services Lyon", dateLimite: "20 aout 2025" }, { id: 2, titre: "Construction d'un immeuble de bureaux", entreprise: "Immo Construct", dateLimite: "5 septembre 2025" }, { id: 3, titre: "Refection de voirie - Zone industrielle", entreprise: "Travaux & Co", dateLimite: "12 aout 2025" }]); } finally { setLoading(false); } }, []);

  useEffect(() => { loadRecentOffers(); }, [loadRecentOffers]);
  useEffect(() => { if (!autoRefreshMs || autoRefreshMs < 1000) return; const id = setInterval(loadRecentOffers, autoRefreshMs); return () => clearInterval(id); }, [autoRefreshMs, loadRecentOffers]);

  if (loading) return (<div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse"><div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>{[1,2,3].map((index) => (<div key={index} className="border rounded-lg p-4 mb-4"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div><div className="h-3 bg-gray-200 rounded w-1/3"></div></div>))}</div>);

  return (<div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 p-6 rounded-xl border border-gray-200 shadow-sm"><h2 className="text-lg font-semibold text-white mb-4 flex items-center"><RiFileList3Line className="text-orange-500 mr-2" /> Appels d'offres recents</h2><ul className="space-y-4">{offres.map((offre) => (<li key={offre.id} className="border rounded-lg p-4 hover:bg-gradient-to-r from-blue-400 via-blue-500 to-orange-300"><h3 className="font-medium text-white">{offre.titre}</h3><p className="text-sm text-white">Date limite : {offre.dateLimite}</p></li>))}</ul></div>);
}

export default OffresRecents;
