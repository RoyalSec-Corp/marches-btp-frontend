// src/pages/Contrats/components/ConfirmationStep.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateContractFees, formatEuro } from '../../../utils/contractCalculations';

function ConfirmationStep({ contractData, selectedFreelance, createdContract }) {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/dashboard-entreprise');
  };

  // Calcul des frais basé sur les données réelles
  const fees = calculateContractFees(contractData || {});
  
  // Formatage des dates
  const formatDate = (dateStr) => {
    if (!dateStr) return 'À définir';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Génération du numéro de contrat
  const contractNumber = createdContract?.id 
    ? `#CTR-${new Date().getFullYear()}-${String(createdContract.id).padStart(4, '0')}`
    : '#CTR-XXXX-XXXX';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <i className="ri-check-line text-2xl text-green-600"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Contrat direct créé avec succès !</h2>
        <p className="text-gray-600">Le freelance a été notifié et doit maintenant accepter ou refuser</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé du contrat finalisé</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li><strong>Numéro de contrat :</strong> {contractNumber}</li>
            <li><strong>Mission :</strong> {contractData?.title || 'Non définie'}</li>
            <li><strong>Type de prestation :</strong> {contractData?.skills || 'Non défini'}</li>
            <li><strong>Date de début :</strong> {formatDate(contractData?.startDate)}</li>
            <li><strong>Adresse :</strong> {contractData?.location || 'Non définie'}</li>
          </ul>
        </div>
        <div>
          <ul className="text-sm text-gray-700 space-y-2 mt-10 md:mt-0">
            <li><strong>Freelance sélectionné :</strong> {selectedFreelance?.nom || selectedFreelance?.name || 'Non défini'}</li>
            <li><strong>Durée :</strong> {fees.durationDisplay}</li>
            <li><strong>Tarif :</strong> {fees.budgetDisplay}</li>
            <li><strong>Montant total :</strong> <span className="text-blue-600 font-semibold">{formatEuro(fees.totalTTC)}</span></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
          <i className="ri-download-line mr-2"></i> Télécharger le contrat
        </button>
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
          <i className="ri-mail-send-line mr-2"></i> Envoyer par email
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10 text-sm text-gray-700 space-y-2">
        <p><strong>ℹ️ Prochaines étapes :</strong></p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Le freelance a été notifié et confirmera sa disponibilité</li>
          <li>Vous recevrez une notification de confirmation dans les 24h</li>
          <li>Vous pourrez suivre l’avancement depuis votre tableau de bord</li>
        </ul>
      </div>

      <div className="text-center">
        <button
  onClick={handleGoToDashboard}
  className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition"
>
  Accéder au tableau de bord
</button>
      </div>
    </div>
  );
}

export default ConfirmationStep;
