import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import contractsApi from '../../services/contractsApi';
import ContractSignatureSimple from '../../components/ContractSignatureSimple';

const DetailsContrat = () => {
  const { state: contractFromState } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [contract, setContract] = useState(contractFromState || null);
  const [loading, setLoading] = useState(!contractFromState);
  const [error, setError] = useState(null);

  // Charger les détails du contrat si pas passé via state
  useEffect(() => {
    if (!contract && id) {
      loadContractDetails();
    }
  }, [id, contract]);

  const loadContractDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const contractData = await contractsApi.getContractById(id);
      setContract(contractData);
    } catch (error) {
      console.error('Erreur lors du chargement du contrat:', error);
      setError('Impossible de charger les détails du contrat');
    } finally {
      setLoading(false);
    }
  };

  // Callback quand le stade du contrat change
  const handleStageUpdate = async (newStage) => {
    // Recharger les détails du contrat
    if (id) {
      await loadContractDetails();
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement du contrat...</p>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error || 'Aucune donnée de contrat trouvée'}</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          ← Retour
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Détails du Contrat</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          ← Retour
        </button>
      </div>
      
      {/* Informations principales du contrat */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{contract.title}</h2>
            <p className="text-gray-600">Contrat #{contract.id}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{contract.description || 'Pas de description'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Statut</h3>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                contract.stage === 'signed' 
                  ? 'bg-green-100 text-green-800' 
                  : contract.stage === 'accepted' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : contract.stage === 'completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {contract.stage === 'accepted' ? 'Accepté - En attente de signature' :
                 contract.stage === 'signed' ? 'Signé - Projet en cours' :
                 contract.stage === 'completed' ? 'Terminé' :
                 contract.status_display || contract.stage || 'Non défini'}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-900">Budget</h3>
              <p className="text-lg font-semibold text-green-600">
                {contract.budget_formatted || (contract.budget ? `${contract.budget} €` : 'Non défini')}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Durée</h3>
              <p className="text-gray-700">
                {contract.duration} {contract.duration_unit || 'jours'}
              </p>
            </div>
            {contract.start_date && (
              <div>
                <h3 className="font-medium text-gray-900">Date de début</h3>
                <p className="text-gray-700">
                  {contract.start_date_formatted || new Date(contract.start_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Système de signature unifié et simplifié */}
      {contract.id && (
        <div className="mb-6">
          <ContractSignatureSimple
            contractId={contract.id}
            onStatusChange={handleStageUpdate}
          />
        </div>
      )}

      {/* Informations complémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partie prenantes */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Parties prenantes</h3>
          <div className="space-y-4">
            {contract.freelance_nom && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-sm">👤</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Freelance</p>
                  <p className="text-gray-600">{contract.freelance_prenom} {contract.freelance_nom}</p>
                </div>
              </div>
            )}
            {contract.nom_entreprise && (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-sm">🏢</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Entreprise</p>
                  <p className="text-gray-600">{contract.nom_entreprise}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dates importantes */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dates importantes</h3>
          <div className="space-y-3">
            {contract.created_at && (
              <div className="flex justify-between">
                <span className="text-gray-600">Créé le:</span>
                <span className="font-medium">{new Date(contract.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {contract.signature_completed_at && (
              <div className="flex justify-between">
                <span className="text-gray-600">Signé le:</span>
                <span className="font-medium text-green-600">
                  {new Date(contract.signature_completed_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
            {contract.deadline && (
              <div className="flex justify-between">
                <span className="text-gray-600">Échéance:</span>
                <span className="font-medium">{new Date(contract.deadline).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsContrat;
