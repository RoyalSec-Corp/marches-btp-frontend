import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import contractsApi from '../../services/contractsApi';
import ContractSignature from '../../components/ContractSignature';
import { useAuth } from '../../context/AuthContext';

const SignerContrat = () => {
  const { state: contractFromState } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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

  // Callback quand la signature est complète
  const handleSignatureComplete = async () => {
    // Recharger les détails du contrat
    if (id) {
      await loadContractDetails();
    }
  };

  // Générer et télécharger le PDF du contrat
  const generatePDF = () => {
    // Créer le contenu HTML pour le PDF
    const contractHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Contrat - ${contract.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin: 20px 0; }
          .parties { display: flex; justify-content: space-between; margin: 30px 0; }
          .partie { width: 45%; }
          .signature-zone { border: 1px solid #ccc; height: 100px; margin-top: 10px; }
          .terms { background: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CONTRAT DE PRESTATION</h1>
          <p>Contrat #${contract.id}</p>
        </div>

        <div class="section">
          <h2>OBJET DU CONTRAT</h2>
          <p><strong>Titre:</strong> ${contract.title}</p>
          <p><strong>Description:</strong> ${contract.description || 'Non spécifiée'}</p>
        </div>

        <div class="section">
          <h2>CONDITIONS FINANCIÈRES</h2>
          <p><strong>Montant:</strong> ${contract.budget_formatted || contract.budget + ' €'}</p>
          <p><strong>Durée:</strong> ${contract.duration} ${contract.duration_unit || 'jours'}</p>
          ${contract.start_date ? `<p><strong>Date de début:</strong> ${new Date(contract.start_date).toLocaleDateString('fr-FR')}</p>` : ''}
        </div>

        <div class="parties">
          <div class="partie">
            <h3>ENTREPRISE</h3>
            <p><strong>Raison sociale:</strong> ${contract.nom_entreprise || 'Non spécifiée'}</p>
            <p><strong>Représentée par:</strong> Le responsable légal</p>
            <div class="signature-zone">
              <p style="text-align: center; margin-top: 35px; color: #666;">Signature Entreprise</p>
            </div>
            <p style="text-align: center; margin-top: 10px;">Date: ___________</p>
          </div>
          
          <div class="partie">
            <h3>FREELANCE</h3>
            <p><strong>Nom:</strong> ${contract.freelance_prenom || ''} ${contract.freelance_nom || 'Non spécifié'}</p>
            <p><strong>Statut:</strong> Freelance indépendant</p>
            <div class="signature-zone">
              <p style="text-align: center; margin-top: 35px; color: #666;">Signature Freelance</p>
            </div>
            <p style="text-align: center; margin-top: 10px;">Date: ___________</p>
          </div>
        </div>

        <div class="terms">
          <h2>CONDITIONS GÉNÉRALES</h2>
          <p>• Ce contrat lie les deux parties selon les termes convenus</p>
          <p>• Les prestations devront être réalisées dans les délais impartis</p>
          <p>• Le paiement s'effectuera selon les modalités convenues</p>
          <p>• Toute modification devra faire l'objet d'un avenant signé</p>
        </div>

        <div class="section">
          <p><strong>Fait le:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          <p><strong>Lieu:</strong> France</p>
        </div>
      </body>
      </html>
    `;

    // Créer et télécharger le PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(contractHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du contrat...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Contrat non trouvé'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec actions */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Signature de Contrat</h1>
              <p className="text-gray-600">Contrat #{contract.id} - {contract.title}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                📄 Télécharger PDF
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← Retour
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Informations du contrat */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{contract.title}</h2>
              <p className="text-gray-600">Contrat prêt pour signature bilatérale</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">📝 Description</h3>
              <p className="text-gray-700 text-sm">{contract.description || 'Aucune description fournie'}</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">💰 Conditions financières</h3>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-green-600">
                  {contract.budget_formatted || (contract.budget ? `${contract.budget} €` : 'Non défini')}
                </p>
                <p className="text-sm text-gray-600">
                  Durée: {contract.duration} {contract.duration_unit || 'jours'}
                </p>
                {contract.start_date && (
                  <p className="text-sm text-gray-600">
                    Début: {new Date(contract.start_date).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">👥 Parties contractantes</h3>
              <div className="space-y-2">
                {contract.freelance_nom && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">👤</span>
                    <span className="text-sm">{contract.freelance_prenom} {contract.freelance_nom}</span>
                  </div>
                )}
                {contract.nom_entreprise && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🏢</span>
                    <span className="text-sm">{contract.nom_entreprise}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interface de signature */}
        <ContractSignature
          contractId={contract.id}
          contract={contract}
          onSignatureComplete={handleSignatureComplete}
        />

        {/* Informations légales */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mt-6">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Informations importantes</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Les deux parties doivent signer pour que le contrat soit valide</li>
                <li>• Une fois signé, le contrat devient juridiquement contraignant</li>
                <li>• Vous pouvez télécharger le PDF à tout moment pour vos archives</li>
                <li>• Les signatures numériques ont la même valeur légale que les signatures manuscrites</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignerContrat;
