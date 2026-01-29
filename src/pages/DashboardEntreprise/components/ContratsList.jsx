import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import contractsApi from '../../../services/contractsApi';
import ContractProgressTracker from '../../../components/ContractProgressTracker';
import { contractTrackingService } from '../../../services/contractTrackingService';

function ContratsList() {
  const navigate = useNavigate();
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [contractMetrics, setContractMetrics] = useState({});
  const [loadingMetrics, setLoadingMetrics] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadContracts();
    let refreshInterval;
    if (autoRefresh) { refreshInterval = setInterval(() => { loadContracts(true); }, 60000); }
    return () => { if (refreshInterval) clearInterval(refreshInterval); };
  }, [autoRefresh]);

  useEffect(() => { contrats.forEach(contract => { if (canTrackContract(contract)) { loadContractMetrics(contract.id); } }); }, [contrats]);

  const loadContracts = async (silent = false) => { try { if (!silent) setLoading(true); setError(null); const data = await contractsApi.listMyEnterpriseContracts(); setContrats(data || []); } catch (err) { console.error('Erreur:', err); setError('Erreur lors du chargement des contrats'); } finally { if (!silent) setLoading(false); } };

  const loadContractMetrics = async (contractId) => { try { setLoadingMetrics(prev => ({ ...prev, [contractId]: true })); const metrics = await contractTrackingService.getRealTimeMetrics(contractId); setContractMetrics(prev => ({ ...prev, [contractId]: metrics })); } catch (err) { console.error('Erreur metriques:', err); } finally { setLoadingMetrics(prev => ({ ...prev, [contractId]: false })); } };

  const getStatusColor = (status) => { switch (status) { case 'published': case 'assigned': case 'accepted': return 'green'; case 'en attente': return 'orange'; case 'completed': return 'blue'; case 'rejected': return 'red'; default: return 'gray'; } };
  const formatDuration = (contract) => { if (contract.duration && contract.duration_unit) return `${contract.duration} ${contract.duration_unit}`; return contract.type_tarif === 'horaire' ? 'Horaire' : contract.type_tarif === 'journalier' ? 'Journalier' : '\u2014'; };
  const formatDate = (contract) => { const startDate = contract.start_date_formatted || contract.start_date; const createdDate = contract.created_date_formatted; if (startDate && startDate !== 'null') return `Debut: ${startDate}`; return `Cree: ${createdDate}`; };
  const handleOpenTracker = (contract) => { setSelectedContract(contract); setShowTracker(true); };
  const handleCloseTracker = () => { setShowTracker(false); setSelectedContract(null); loadContracts(); };
  const canTrackContract = (contract) => ['accepted', 'assigned', 'signed', 'in_progress', 'deliverable_submitted', 'under_review', 'validated', 'invoiced', 'payment_pending', 'completed'].includes(contract.statut);
  const getProgressPercentage = (contract) => { const metrics = contractMetrics[contract.id]; if (metrics) return metrics.completion_percentage || 0; const progressMap = { 'accepted': 10, 'signed': 20, 'assigned': 25, 'in_progress': 40, 'deliverable_submitted': 60, 'under_review': 75, 'validated': 85, 'invoiced': 90, 'payment_pending': 95, 'completed': 100 }; return progressMap[contract.statut] || 0; };
  const getProgressColor = (percentage) => { if (percentage < 30) return 'bg-red-500'; if (percentage < 60) return 'bg-yellow-500'; if (percentage < 90) return 'bg-blue-500'; return 'bg-green-500'; };
  const getStageIcon = (status) => { const icons = { 'accepted': '\ud83e\udd1d', 'signed': '\ud83d\udcdd', 'assigned': '\ud83d\udc64', 'in_progress': '\u26a1', 'deliverable_submitted': '\ud83d\udce4', 'under_review': '\ud83d\udd0d', 'validated': '\u2705', 'invoiced': '\ud83d\udcb0', 'payment_pending': '\u23f3', 'completed': '\ud83c\udf89' }; return icons[status] || '\ud83d\udcc4'; };
  const formatEfficiencyScore = (contractId) => { const metrics = contractMetrics[contractId]; if (!metrics) return '\u2014'; return `${Math.round(metrics.efficiency_score || 0)}%`; };
  const formatDaysActive = (contractId) => { const metrics = contractMetrics[contractId]; if (!metrics) return '\u2014'; return `${metrics.days_active || 0}j`; };

  const handleQuickStageUpdate = async (contract, newStage) => { try { await contractTrackingService.updateStageIntelligent(contract.id, newStage, 'entreprise', `Mise a jour rapide vers ${newStage}`); await loadContracts(); await loadContractMetrics(contract.id); alert(`Contrat mis a jour vers: ${newStage}`); } catch (err) { console.error('Erreur mise a jour rapide:', err); alert('Erreur lors de la mise a jour'); } };

  const getQuickActions = (contract) => { const actions = []; switch (contract.statut) { case 'accepted': actions.push({ label: 'Marquer signe', stage: 'signed', color: 'bg-green-600' }); break; case 'signed': actions.push({ label: 'Demarrer', stage: 'in_progress', color: 'bg-blue-600' }); break; case 'deliverable_submitted': actions.push({ label: 'Valider', stage: 'validated', color: 'bg-green-600' }); actions.push({ label: 'Revision', stage: 'under_review', color: 'bg-yellow-600' }); break; case 'validated': actions.push({ label: 'Facturer', stage: 'invoiced', color: 'bg-indigo-600' }); break; case 'payment_pending': actions.push({ label: 'Marquer paye', stage: 'completed', color: 'bg-green-600' }); break; } return actions; };

  const filteredContrats = contrats.filter(contract => contract.title?.toLowerCase().includes(searchTerm.toLowerCase()) || contract.description?.toLowerCase().includes(searchTerm.toLowerCase()) || contract.freelance_name?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (<div className="bg-gradient-to-br from-blue-300 via-blue-400 to-blue-300 rounded-xl p-6 shadow-sm border border-blue-200"><h2 className="text-xl font-semibold text-gray-900 mb-6">Contrats</h2><div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div><span className="ml-2 text-gray-600">Chargement...</span></div></div>);
  if (error) return (<div className="bg-gradient-to-br from-blue-300 via-blue-400 to-blue-300 rounded-xl p-6 shadow-sm border border-blue-200"><h2 className="text-xl font-semibold text-gray-900 mb-6">Contrats</h2><div className="text-center py-8"><p className="text-red-600 mb-4">{error}</p><button onClick={loadContracts} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Reessayer</button></div></div>);

  if (showTracker && selectedContract) return (<div className="space-y-6"><div className="bg-gradient-to-br from-blue-300 via-blue-400 to-blue-300 rounded-xl p-6 shadow-sm border border-blue-200"><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold text-gray-900">Suivi du contrat: {selectedContract.title}</h2><button onClick={handleCloseTracker} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2">\u2190 Retour a la liste</button></div></div><ContractProgressTracker contractId={selectedContract.id} userType="entreprise" onStageUpdate={handleCloseTracker} /></div>);

  return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-400 rounded-xl p-6 shadow-sm border border-blue-200">
      <h2 className="text-xl font-semibold text-white mb-6">Contrats</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4"><button onClick={() => setAutoRefresh(!autoRefresh)} className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${autoRefresh ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}><span className={autoRefresh ? 'animate-pulse' : ''}>{autoRefresh ? '\ud83d\udd04' : '\u23f8\ufe0f'}</span>Auto-refresh</button><div className="text-sm text-white">{contrats.length} contrat{contrats.length !== 1 ? 's' : ''}</div></div>
        <div className="flex items-center gap-3"><button onClick={() => loadContracts()} disabled={loading} className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"><span className={loading ? 'animate-spin' : ''}>\ud83d\udd04</span>Actualiser</button><input type="text" placeholder="Rechercher un contrat..." className="form-input w-64 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
      </div>
      {filteredContrats.length === 0 ? (<div className="text-center py-8 text-gray-500">{contrats.length === 0 ? 'Aucun contrat trouve' : 'Aucun contrat ne correspond a votre recherche'}</div>) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm"><thead className="text-left text-white border-b"><tr><th className="py-2 px-3">Projet & Progression</th><th className="py-2 px-3">Freelance</th><th className="py-2 px-3">Dates & Metriques</th><th className="py-2 px-3">Montant</th><th className="py-2 px-3">Statut & Etape</th><th className="py-2 px-3">Actions</th></tr></thead>
            <tbody className="text-white">
              {filteredContrats.map((contrat) => (
                <tr key={contrat.id} className="border-b hover:bg-gradient-to-br from-blue-600 via-blue-700 to-blue-600 transition-colors duration-300">
                  <td className="py-3 px-3"><div className="font-medium flex items-center gap-2">{getStageIcon(contrat.statut)} {contrat.title}</div><div className="text-xs text-white truncate max-w-xs mb-2">{contrat.description}</div>{canTrackContract(contrat) && (<div className="flex items-center gap-2 mt-2"><div className="flex-1 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(getProgressPercentage(contrat))}`} style={{ width: `${getProgressPercentage(contrat)}%` }}></div></div><span className="text-xs font-medium text-white min-w-[35px]">{getProgressPercentage(contrat)}%</span></div>)}</td>
                  <td className="py-3 px-3"><div>{contrat.freelance_name}</div>{contrat.freelance_location && (<div className="text-xs text-white">{contrat.freelance_location}</div>)}</td>
                  <td className="py-3 px-3"><div className="text-sm">{formatDate(contrat)}</div><div className="text-xs text-white">{formatDuration(contrat)}</div>{canTrackContract(contrat) && (<div className="mt-2 space-y-1">{loadingMetrics[contrat.id] ? (<div className="text-xs text-gray-400">\u23f3 Chargement...</div>) : (<><div className="text-xs text-blue-600 flex items-center gap-1">\ud83d\udcca Efficacite: {formatEfficiencyScore(contrat.id)}</div><div className="text-xs text-green-600 flex items-center gap-1">\u23f0 Actif: {formatDaysActive(contrat.id)}</div></>)}</div>)}</td>
                  <td className="py-3 px-3 font-medium">{contrat.budget_formatted}</td>
                  <td className="py-3 px-3"><div className="space-y-2"><span className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 ${getStatusColor(contrat.statut) === 'green' ? 'bg-green-100 text-green-800' : getStatusColor(contrat.statut) === 'orange' ? 'bg-orange-100 text-orange-800' : getStatusColor(contrat.statut) === 'blue' ? 'bg-blue-100 text-blue-800' : getStatusColor(contrat.statut) === 'red' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{getStageIcon(contrat.statut)} {contrat.status_display}</span>{canTrackContract(contrat) && (<div className="flex flex-wrap gap-1">{getQuickActions(contrat).map((action, index) => (<button key={index} onClick={() => handleQuickStageUpdate(contrat, action.stage)} className={`text-xs px-2 py-1 rounded text-white hover:opacity-80 transition-opacity ${action.color}`} title={`Changer vers: ${action.stage}`}>{action.label}</button>))}</div>)}</div></td>
                  <td className="py-3 px-3"><div className="flex gap-2 flex-wrap"><button onClick={() => navigate("/details-contrat", { state: contrat })} className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-700">Details</button>{(contrat.statut === 'accepted' || contrat.statut === 'assigned') && (<button onClick={() => navigate(`/signer-contrat/${contrat.id}`)} className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 flex items-center gap-1 font-semibold">\u270d\ufe0f Signer contrat</button>)}{canTrackContract(contrat) && (<button onClick={() => handleOpenTracker(contrat)} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1">\ud83d\udcca Suivi</button>)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContratsList;
