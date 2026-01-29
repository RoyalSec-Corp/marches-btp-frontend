import React, { useState, useEffect } from 'react';
import { RiSearchLine, RiMapPinLine, RiMoneyDollarCircleLine, RiCalendarLine, RiEyeLine, RiSendPlaneLine, RiFilterLine, RiCloseLine, RiBuilding2Line, RiExternalLinkLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import callsForTendersApi from '../../../services/callsForTendersApi';

function AppelsOffresList() {
  const [callsForTenders, setCallsForTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ localisation: '', type_construction: '', budget_min: '', budget_max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCallForTender, setSelectedCallForTender] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({ proposition: '', budget_propose: '', duree_proposee: '', lettre_motivation: '' });
  const [submitting, setSubmitting] = useState(false);
  const [appliedCallsIds, setAppliedCallsIds] = useState(new Set());

  useEffect(() => { loadCallsForTenders(); loadUserApplications(); }, []);

  const loadCallsForTenders = async () => { try { setLoading(true); const result = await callsForTendersApi.listCallsForTenders(filters); setCallsForTenders(result.calls_for_tenders || []); } catch (err) { console.error('Erreur:', err); setError('Erreur lors du chargement des appels d\'offres'); } finally { setLoading(false); } };
  const applyFilters = () => { setShowFilters(false); loadCallsForTenders(); };
  const loadUserApplications = async () => { try { console.log('[AppelsOffresList] Chargement des candidatures utilisateur...'); } catch (err) { console.error('Erreur:', err); } };
  const handleSearch = () => { setFilters(prev => ({ ...prev, search: searchTerm })); };
  const resetFilters = () => { setFilters({ localisation: '', type_construction: '', budget_min: '', budget_max: '' }); setSearchTerm(''); setShowFilters(false); };
  const openApplicationModal = (callForTender) => { setSelectedCallForTender(callForTender); setApplicationData({ proposition: '', budget_propose: '', duree_proposee: '', lettre_motivation: '' }); setShowApplicationModal(true); };
  const closeApplicationModal = () => { setShowApplicationModal(false); setSelectedCallForTender(null); setApplicationData({ proposition: '', budget_propose: '', duree_proposee: '', lettre_motivation: '' }); };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCallForTender) return;
    try {
      setSubmitting(true);
      const response = await callsForTendersApi.applyToCallForTender(selectedCallForTender.id, applicationData);
      setAppliedCallsIds(prev => new Set(prev).add(selectedCallForTender.id));
      toast.success('Candidature envoyee avec succes !');
      closeApplicationModal();
      loadCallsForTenders();
    } catch (err) {
      if (err.response && err.response.status === 409) { setAppliedCallsIds(prev => new Set(prev).add(selectedCallForTender.id)); toast.error('Vous avez deja postule a cet appel d\'offre.'); closeApplicationModal(); }
      else { const errorMessage = err?.response?.data?.error || 'Erreur lors de l\'envoi de la candidature.'; toast.error(errorMessage); }
    } finally { setSubmitting(false); }
  };

  const formatCurrency = (amount) => { if (!amount) return 'N/C'; return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount); };
  const getStatusColor = (daysRemaining) => { if (!daysRemaining || daysRemaining <= 0) return 'text-red-600 bg-red-50'; if (daysRemaining <= 7) return 'text-orange-600 bg-orange-50'; return 'text-green-600 bg-green-50'; };
  const filteredCallsForTenders = callsForTenders.filter(call => (call.titre || "Offre sans titre").toLowerCase().includes(searchTerm.toLowerCase()) || call.description?.toLowerCase().includes(searchTerm.toLowerCase()) || call.localisation?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>);
  if (error) return (<div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">{error}</p><button onClick={loadCallsForTenders} className="mt-2 text-red-600 hover:text-red-800 underline">Reessayer</button></div>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-white">Appels d'Offres</h2><p className="text-white">Decouvrez les derniers appels d'offres publies</p></div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative"><RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Rechercher un appel d'offre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" /></div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 text-white"><RiFilterLine className="mr-2" />Filtres</button>
        </div>
      </div>

      {showFilters && (<div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 border border-gray-200 rounded-lg p-4 space-y-4"><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label className="block text-sm font-medium text-white mb-1">Localisation</label><input type="text" value={filters.localisation} onChange={(e) => setFilters(prev => ({ ...prev, localisation: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" /></div><div><label className="block text-sm font-medium text-white mb-1">Type</label><select value={filters.type_construction} onChange={(e) => setFilters(prev => ({ ...prev, type_construction: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"><option value="">Tous types</option><option value="maison">Maison individuelle</option><option value="appartement">Appartement</option><option value="commercial">Batiment commercial</option><option value="industriel">Batiment industriel</option><option value="renovation">Renovation</option></select></div><div><label className="block text-sm font-medium text-white mb-1">Budget min</label><input type="number" value={filters.budget_min} onChange={(e) => setFilters(prev => ({ ...prev, budget_min: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" /></div><div><label className="block text-sm font-medium text-white mb-1">Budget max</label><input type="number" value={filters.budget_max} onChange={(e) => setFilters(prev => ({ ...prev, budget_max: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" /></div></div><div className="flex gap-3"><button onClick={applyFilters} className="px-4 py-2 bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 text-white rounded-lg">Appliquer</button><button onClick={resetFilters} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Reinitialiser</button></div></div>)}

      <div className="grid gap-6">
        {filteredCallsForTenders.length === 0 ? (<div className="text-center py-12 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg"><RiBuilding2Line className="mx-auto h-12 w-12 text-gray-400 mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">Aucun appel d'offre trouve</h3></div>) : (
          filteredCallsForTenders.map((callForTender) => (
            <div key={callForTender.id} className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div><h3 className="text-xl font-semibold text-white mb-1">{callForTender.titre || "Offre sans titre"}</h3>{callForTender.url_source && (<span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded border border-orange-200 font-bold mb-1">Source Externe</span>)}</div>
                    {callForTender.days_remaining !== null && (<span className={`px-3 py-1 rounded-full text-orange-500 bg-orange-400/20 border border-orange-400/40 text-sm font-medium ${getStatusColor(callForTender.days_remaining)}`}>{callForTender.days_remaining <= 0 ? 'Expire' : `${callForTender.days_remaining} jour(s)`}</span>)}
                  </div>
                  <p className="text-white mb-4 line-clamp-3">{callForTender.description.replace(/\[SOURCE.*?\]/g, '')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-white"><RiMapPinLine className="mr-2 text-orange-500" />{callForTender.localisation || callForTender.ville || "A definir"}</div>
                    <div className="flex items-center text-sm text-white"><RiMoneyDollarCircleLine className="mr-2 text-orange-400" />{formatCurrency(callForTender.budget)}</div>
                    {callForTender.date_limite && (<div className="flex items-center text-sm text-white"><RiCalendarLine className="mr-2 text-orange-400" />{new Date(callForTender.date_limite).toLocaleDateString('fr-FR')}</div>)}
                    <div className="flex items-center text-sm text-white"><RiBuilding2Line className="mr-2 text-orange-400" />{callForTender.type_construction || "Non specifie"}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 lg:ml-6">
                  <button onClick={() => alert('Vue detaillee a venir')} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"><RiEyeLine className="mr-2" /> Voir details</button>
                  {appliedCallsIds.has(callForTender.id) ? (<div className="flex items-center justify-center px-4 py-2 rounded-lg bg-green-100 text-green-700 border border-green-200"><RiSendPlaneLine className="mr-2" /> Candidature envoyee</div>) : (<>{callForTender.url_source ? (<a href={callForTender.url_source} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition font-bold shadow-md"><RiExternalLinkLine className="mr-2" /> Postuler sur site</a>) : (<button onClick={() => openApplicationModal(callForTender)} disabled={callForTender.days_remaining <= 0} className={`flex items-center justify-center px-4 py-2 rounded-lg ${callForTender.days_remaining <= 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-300 hover:to-blue-500 transition-all duration-300'}`}><RiSendPlaneLine className="mr-2" /> Postuler</button>)}</>)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showApplicationModal && selectedCallForTender && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"><div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div className="p-6"><div className="flex items-center justify-between mb-6"><h3 className="text-xl font-semibold text-gray-900">Postuler a l'appel d'offre</h3><button onClick={closeApplicationModal} className="text-gray-400 hover:text-gray-600"><RiCloseLine size={24} /></button></div><div className="mb-6 p-4 bg-gray-50 rounded-lg"><h4 className="font-semibold text-gray-900 mb-2">{selectedCallForTender.titre}</h4><p className="text-gray-600 text-sm">{selectedCallForTender.description}</p></div><form onSubmit={handleApplicationSubmit} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Proposition technique *</label><textarea required rows={4} value={applicationData.proposition} onChange={(e) => setApplicationData(prev => ({ ...prev, proposition: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Budget propose (\u20ac) *</label><input type="number" required value={applicationData.budget_propose} onChange={(e) => setApplicationData(prev => ({ ...prev, budget_propose: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Duree proposee</label><input type="text" value={applicationData.duree_proposee} onChange={(e) => setApplicationData(prev => ({ ...prev, duree_proposee: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div><div className="flex gap-3 pt-4"><button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{submitting ? 'Envoi...' : 'Envoyer'}</button><button type="button" onClick={closeApplicationModal} className="px-4 py-2 border rounded-lg">Annuler</button></div></form></div></div></div>)}
    </div>
  );
}

export default AppelsOffresList;
