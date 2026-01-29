// src/components/CandidatureManager.jsx
import React, { useState, useEffect } from 'react';
import contractService from '../services/contractService';
import { RiSearchLine, RiSortAsc, RiSortDesc, RiStarFill } from 'react-icons/ri';

function CandidatureManager({ contractId, entrepriseId }) {
  const [contract, setContract] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [notes, setNotes] = useState({});
  const [showNotes, setShowNotes] = useState({});

  useEffect(() => {
    if (!contractId) {
      setContract(null);
      setApplications([]);
      return;
    }
    loadContractAndApplications();
  }, [contractId]);

  useEffect(() => {
    const savedNotes = localStorage.getItem(`candidature_notes_${contractId}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [contractId]);

  const saveNote = (applicationId, note) => {
    const newNotes = { ...notes, [applicationId]: note };
    setNotes(newNotes);
    localStorage.setItem(`candidature_notes_${contractId}`, JSON.stringify(newNotes));
  };

  const loadContractAndApplications = async () => {
    try {
      setFetchError('');
      setLoading(true);
      const [c, apps] = await Promise.all([
        contractService.getContractById(contractId),
        contractService.getApplicationsForContract(contractId),
      ]);
      setContract(c || null);
      setApplications(Array.isArray(apps) ? apps : []);
    } catch (e) {
      setFetchError(e?.message || 'Erreur de chargement');
      setContract(null);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplication = async (application) => {
    if (!entrepriseId) {
      alert("Entreprise non authentifiée.");
      return;
    }
    if (!contract || contract.status !== 'published') {
      alert("Ce contrat n'est plus éligible à l'attribution.");
      return;
    }
    try {
      setLoading(true);
      await contractService.acceptApplication(contractId, application.id);
      alert('Candidature acceptée avec succès !');
      await loadContractAndApplications();
    } catch (error) {
      alert('Erreur: ' + (error.message || 'inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const handleRejectApplication = async (application) => {
    if (!entrepriseId) {
      alert("Entreprise non authentifiée.");
      return;
    }
    if (!contract || contract.status !== 'published') {
      alert("Ce contrat n'est plus éligible à l'attribution.");
      return;
    }
    try {
      setLoading(true);
      await contractService.rejectApplication(contractId, application.id);
      alert('Candidature refusée avec succès !');
      await loadContractAndApplications();
    } catch (error) {
      alert('Erreur: ' + (error.message || 'inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatMoney = (n) => `${Number(n || 0).toLocaleString('fr-FR')} €`;

  const calculateScore = (application) => {
    let score = 0;
    if (contract && application.proposedBudget) {
      const budgetDiff = Math.abs(contract.budget - application.proposedBudget);
      const budgetScore = Math.max(0, 100 - (budgetDiff / contract.budget) * 100);
      score += budgetScore * 0.4;
    }
    score += 30;
    if (application.proposal) {
      const proposalLength = application.proposal.length;
      const proposalScore = Math.min(100, proposalLength / 2);
      score += proposalScore * 0.3;
    }
    return Math.round(score);
  };

  const filteredApplications = applications.filter(application => {
    const searchMatch =
      (application.freelance_nom && application.freelance_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (application.freelance_prenom && application.freelance_prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (application.freelance_email && application.freelance_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (application.proposal && application.proposal.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch = filterStatus === 'all' || application.status === filterStatus;
    return searchMatch && statusMatch;
  }).sort((a, b) => {
    let compareValue = 0;
    switch (sortBy) {
      case 'date':
        compareValue = new Date(b.createdAt) - new Date(a.createdAt);
        break;
      case 'budget':
        compareValue = (b.proposedBudget || 0) - (a.proposedBudget || 0);
        break;
      case 'score':
        compareValue = calculateScore(b) - calculateScore(a);
        break;
      default:
        compareValue = 0;
    }
    return sortOrder === 'asc' ? -compareValue : compareValue;
  });

  if (!contractId) return <div className="text-gray-500">Sélectionnez un contrat.</div>;
  if (loading && !contract) return <div className="text-gray-500">Chargement…</div>;
  if (fetchError) return <div className="text-red-600 text-sm">{fetchError}</div>;
  if (!contract) return <div className="text-gray-500">Contrat introuvable.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 border rounded-lg p-6">
        <h3 className="text-lg text-white font-semibold mb-4">
          Candidatures pour « {contract.title || 'Mission'} »
        </h3>
        <div className="mb-4 text-sm text-white grid grid-cols-1 md:grid-cols-3 gap-2">
          <p><span className="font-medium">Statut :</span> {contract.status}</p>
          <p><span className="font-medium">Budget :</span> {formatMoney(contract.budget)}</p>
          <p><span className="font-medium">Durée :</span> {contract.duration && contract.duration_unit
            ? `${contract.duration} ${contract.duration_unit}`
            : '—'}</p>
        </div>
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher par nom, email ou proposition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pl-10 text-sm"
            />
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="selected">Sélectionné</option>
              <option value="rejected">Rejeté</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {sortOrder === 'asc' ? <RiSortAsc /> : <RiSortDesc />}
              Trier
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="date">Date</option>
              <option value="budget">Budget</option>
              <option value="score">Score</option>
            </select>
          </div>
        </div>
        {filteredApplications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white">
              {applications.length === 0
                ? 'Aucune candidature reçue pour le moment.'
                : 'Aucune candidature ne correspond à vos critères de recherche.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const chip =
                application.status === 'selected'
                  ? 'bg-green-100 text-green-800'
                  : application.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800';
              const score = calculateScore(application);
              return (
                <div
                  key={application.id}
                  className={`border rounded-lg p-4 ${
                    application.status === 'selected'
                      ? 'border-green-200 bg-green-50'
                      : application.status === 'rejected'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">
                          {application.freelance_nom && application.freelance_prenom
                            ? `${application.freelance_prenom} ${application.freelance_nom}`
                            : `Freelance #${application.freelance_id || application.id || 'Inconnu'}`
                          }
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${chip}`}>
                          {application.status === 'selected'
                            ? 'Sélectionné'
                            : application.status === 'rejected'
                            ? 'Rejeté'
                            : 'En attente'}
                        </span>
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          <RiStarFill className="text-yellow-500" />
                          <span>{score}/100</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div><span className="font-medium">Budget proposé :</span> {formatMoney(application.proposedBudget)}</div>
                        <div><span className="font-medium">Date de candidature :</span> {formatDate(application.createdAt)}</div>
                      </div>
                      {application.proposal && (
                        <div className="mb-2">
                          <span className="font-medium text-sm">Proposition :</span>
                          <p className="text-sm text-gray-700 mt-1">{application.proposal}</p>
                        </div>
                      )}
                    </div>
                    {application.status === 'pending' && contract.status === 'published' && (
                      <div className="ml-4 flex gap-2 flex-col">
                        <button
                          type="button"
                          onClick={() => handleAcceptApplication(application)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                          disabled={loading}
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectApplication(application)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                          disabled={loading}
                        >
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidatureManager;
