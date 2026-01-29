import React, { useState, useEffect } from 'react';
import contractsApi from '../../../services/contractsApi';
import { RiExternalLinkLine } from 'react-icons/ri';

const normalize = (s = '') => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

function MissionsDisponibles() {
  const [missions, setMissions] = useState([]);
  const [zone, setZone] = useState('Toutes');
  const [type, setType] = useState('Tous');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [applicationData, setApplicationData] = useState({ proposal: '', proposedBudget: '', proposedDuration: '', coverLetter: '' });

  const zones = ['Toutes', 'Lyon 7eme', 'Villeurbanne', 'Venissieux', 'Paris', 'Marseille', 'Toulouse'];
  const types = ['Tous', 'Electricite', 'Plomberie', 'Chauffage', 'Maconnerie', 'Menuiserie', 'Peinture'];

  const loadMissions = async () => {
    try {
      setLoading(true);
      const typeToken = type === 'Tous' ? '' : normalize(type);
      const skillsFilter = typeToken ? [typeToken] : [];
      const filters = { location: zone !== 'Toutes' ? zone : '', search, skills: skillsFilter };
      const res = await contractsApi.listAvailable(filters);
      setMissions(Array.isArray(res) ? res : []);
    } catch (error) { console.error('Erreur lors du chargement des missions :', error); setMissions([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadMissions(); }, []);
  useEffect(() => { loadMissions(); }, [zone, type, search]);

  const handleApply = (mission) => { setSelectedMission(mission); setShowApplicationModal(true); };

  const submitApplication = async () => {
    try {
      if (!selectedMission) return;
      await contractsApi.applyToContract(selectedMission.id, { proposal: applicationData.proposal, proposedBudget: Number(applicationData.proposedBudget || 0), proposedDuration: applicationData.proposedDuration, coverLetter: applicationData.coverLetter });
      alert('Candidature envoyee avec succes !');
      setShowApplicationModal(false); setSelectedMission(null); setApplicationData({ proposal: '', proposedBudget: '', proposedDuration: '', coverLetter: '' }); loadMissions();
    } catch (error) { console.error(error); const msg = error?.response?.data?.error || error?.response?.data?.message || error.message || 'Erreur lors de la candidature.'; alert(msg); }
  };

  const formatBudget = (n) => { const v = Number(n || 0); return isNaN(v) ? '\u2014' : `${v.toLocaleString('fr-FR')} \u20ac`; };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Missions disponibles</h2>
      <div className="flex flex-wrap items-end gap-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 border rounded-lg p-4 shadow-sm">
        <div className="flex-1 min-w-[180px]"><label className="block text-sm text-white mb-1">Zone geographique</label><select value={zone} onChange={e => setZone(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">{zones.map(z => <option key={z}>{z}</option>)}</select></div>
        <div className="flex-1 min-w-[180px]"><label className="block text-sm text-white mb-1">Type de prestation</label><select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">{types.map(t => <option key={t}>{t}</option>)}</select></div>
        <div className="flex-1 min-w-[200px]"><label className="block text-sm text-white mb-1">Recherche</label><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ex: chauffage, electricite..." className="w-full border rounded px-3 py-2 text-sm" /></div>
      </div>
      {loading ? (<p className="text-gray-500 mt-4">Chargement des missions...</p>) : missions.length === 0 ? (<p className="text-gray-500 mt-4">Aucune mission ne correspond a vos criteres.</p>) : (
        missions.map(mission => (
          <div key={mission.id} className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-600 border rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <span className="px-3 py-1 bg-orange-400/20 text-orange-500 text-sm font-medium rounded-full">{Array.isArray(mission.skills) && mission.skills.length ? mission.skills.join(' \u2022 ') : 'Mission'}</span>
                  {mission.company_location && <span className="text-sm text-white">\ud83d\udccd {mission.company_location}</span>}
                  <span className="text-sm text-white">Publie le {new Date(mission.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2 mb-1"><h3 className="text-lg font-semibold text-white">{mission.title || 'Mission sans titre'}</h3>{mission.url_source && <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded border border-orange-200 font-bold">Source Externe</span>}</div>
                <div className="text-sm text-white mb-2"><span className="font-medium">Entreprise :</span> {mission.company_name}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white mb-3">
                  <div><span className="font-medium">Duree :</span> {mission.duration && mission.duration_unit ? `${mission.duration} ${mission.duration_unit}` : (mission.type_tarif === 'horaire' ? 'Horaire' : mission.type_tarif === 'journalier' ? 'Journalier' : 'A convenir')}</div>
                  <div><span className="font-medium">Budget :</span> {formatBudget(mission.budget)} {mission.budget_type && `(${mission.budget_type})`}</div>
                  <div><span className="font-medium">Debut :</span> {mission.start_date ? new Date(mission.start_date).toLocaleDateString('fr-FR') : 'A convenir'}</div>
                </div>
                <p className="text-sm text-white mb-2">{(mission.description || '\u2014').replace(/\[SOURCE.*?\]/g, '')}</p>
                {Array.isArray(mission.skills) && mission.skills.length > 0 && <div className="flex flex-wrap gap-1 mb-2">{mission.skills.map((skill, index) => <span key={index} className="px-2 py-1 bg-orange-400/20 text-orange-500 text-xs rounded">{skill}</span>)}</div>}
              </div>
              <div className="flex flex-col items-end justify-center space-y-2 ml-6">
                {mission.url_source ? (<a href={mission.url_source} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-all duration-300 whitespace-nowrap shadow-md"><RiExternalLinkLine className="mr-2" /> Postuler sur site</a>) : (<button onClick={() => handleApply(mission)} className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg text-sm font-medium hover:to-blue-500 transition-all duration-300 whitespace-nowrap disabled:opacity-50">Postuler</button>)}
              </div>
            </div>
          </div>
        ))
      )}
      {showApplicationModal && selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Candidater a "{selectedMission.title || 'Mission'}"</h3>
            <div className="space-y-3">
              <div><label className="block text-sm text-gray-700 mb-1">Proposition (resume)</label><input type="text" className="w-full border rounded px-3 py-2 text-sm" value={applicationData.proposal} onChange={(e) => setApplicationData(a => ({ ...a, proposal: e.target.value }))} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label className="block text-sm text-gray-700 mb-1">Budget propose (\u20ac)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" value={applicationData.proposedBudget} onChange={(e) => setApplicationData(a => ({ ...a, proposedBudget: e.target.value }))} /></div><div><label className="block text-sm text-gray-700 mb-1">Duree proposee</label><input type="text" placeholder="ex: 10 jours" className="w-full border rounded px-3 py-2 text-sm" value={applicationData.proposedDuration} onChange={(e) => setApplicationData(a => ({ ...a, proposedDuration: e.target.value }))} /></div></div>
              <div><label className="block text-sm text-gray-700 mb-1">Lettre de motivation</label><textarea rows={4} className="w-full border rounded px-3 py-2 text-sm" value={applicationData.coverLetter} onChange={(e) => setApplicationData(a => ({ ...a, coverLetter: e.target.value }))} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-5"><button onClick={() => { setShowApplicationModal(false); setSelectedMission(null); }} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Annuler</button><button onClick={submitApplication} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700">Envoyer la candidature</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MissionsDisponibles;
