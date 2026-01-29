import React, { useState, useEffect } from 'react';
import { RiUserLine, RiTimeLine, RiCheckLine, RiCloseLine, RiEyeLine } from 'react-icons/ri';
import contractsApi from '../../../services/contractsApi';

function Candidatures({ contractId }) {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { if (contractId) loadCandidatures(); }, [contractId]);

  const loadCandidatures = async () => { try { setLoading(true); const data = await contractsApi.getCandidatures(contractId); setCandidatures(data || []); } catch (err) { console.error('Erreur:', err); setError('Erreur lors du chargement des candidatures'); } finally { setLoading(false); } };

  const handleAccept = async (candidatureId) => { try { await contractsApi.acceptCandidature(contractId, candidatureId); loadCandidatures(); } catch (err) { console.error('Erreur:', err); } };
  const handleReject = async (candidatureId) => { try { await contractsApi.rejectCandidature(contractId, candidatureId); loadCandidatures(); } catch (err) { console.error('Erreur:', err); } };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Acceptee</span>;
      case 'rejected': return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Refusee</span>;
      case 'pending': default: return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
    }
  };

  if (loading) return (<div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl p-6 border"><h2 className="text-xl font-semibold text-white mb-4">Candidatures</h2><div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div><span className="ml-2 text-white">Chargement...</span></div></div>);
  if (error) return (<div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl p-6 border"><h2 className="text-xl font-semibold text-white mb-4">Candidatures</h2><div className="text-center py-8"><p className="text-red-400 mb-4">{error}</p><button onClick={loadCandidatures} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Reessayer</button></div></div>);

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl p-6 border">
      <h2 className="text-xl font-semibold text-white mb-4">Candidatures ({candidatures.length})</h2>
      {candidatures.length === 0 ? (<div className="text-center py-8 text-white">Aucune candidature pour ce contrat</div>) : (
        <div className="space-y-4">
          {candidatures.map((candidature) => (
            <div key={candidature.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">{candidature.freelance_name?.charAt(0) || 'F'}</div>
                  <div>
                    <h3 className="font-medium text-white">{candidature.freelance_name}</h3>
                    <p className="text-sm text-white/70">{candidature.freelance_specialite || 'Freelance BTP'}</p>
                    <div className="flex items-center text-xs text-white/60 mt-1"><RiTimeLine className="mr-1" />{new Date(candidature.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                {getStatusBadge(candidature.status)}
              </div>
              {candidature.message && (<div className="mt-3 p-3 bg-white/5 rounded-lg"><p className="text-sm text-white/80">{candidature.message}</p></div>)}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-white"><span className="font-medium">{candidature.budget_propose || candidature.tarif}\u20ac</span>{candidature.duree_proposee && (<span className="ml-2 text-white/70">- {candidature.duree_proposee}</span>)}</div>
                {candidature.status === 'pending' && (<div className="flex gap-2"><button onClick={() => handleReject(candidature.id)} className="flex items-center px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"><RiCloseLine className="mr-1" />Refuser</button><button onClick={() => handleAccept(candidature.id)} className="flex items-center px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"><RiCheckLine className="mr-1" />Accepter</button></div>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Candidatures;
