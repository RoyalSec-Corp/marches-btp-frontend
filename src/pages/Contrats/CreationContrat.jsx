// src/pages/Contrats/CreationContrat.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InformationsStep from './components/InformationsStep';
import SelectionStep from './components/SelectionStep';
import PaiementStep from './components/PaiementStep';
import ConfirmationStep from './components/ConfirmationStep';
import PaiementStepPublication from './components/PaiementStepPublication';
import ConfirmationStepPublication from './components/ConfirmationStepPublication';
import contractService from '../../services/contractService';

function CreationContrat() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null); // "direct" | "publication"
  const [step, setStep] = useState(1);
  const [selectedFreelance, setSelectedFreelance] = useState(null);
  const [contractData, setContractData] = useState({});
  const [createdContract, setCreatedContract] = useState(null);

  const totalSteps = mode === 'publication' ? 3 : 4;

  const selectMode = (selectedMode) => {
    setMode(selectedMode);
    setStep(1);
    setSelectedFreelance(null);
    setContractData({});
    setCreatedContract(null);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleDataChange = (data) => {
    setContractData((prev) => ({ ...prev, ...data }));
  };

  // ---- Validation front légère pour éviter 400 inutiles
  const validateBeforeSubmit = () => {
    const errors = [];
    const title = (contractData.title || '').trim();
    const description = (contractData.description || '').trim();
    const location = (contractData.location || '').trim();
    const budget = Number(contractData.budget);

    if (!mode) errors.push('type de contrat (direct/publication)');
    if (!title) errors.push('titre');
    if (!description) errors.push('description');
    if (Number.isNaN(budget)) errors.push('budget (nombre)');

    if (mode === 'direct' && !selectedFreelance?.id) {
      errors.push('freelance à sélectionner (mode direct)');
    }

    if (errors.length) {
      throw new Error(`Champs manquants/invalides : ${errors.join(', ')}`);
    }

    return { title, description, location, budget };
  };

  // ---- Normalisation pour l’API contrats
  const toServicePayload = () => {
    const { title, description, location, budget } = validateBeforeSubmit();

    const skillsArray = contractData.skills
      ? (Array.isArray(contractData.skills) ? contractData.skills : [contractData.skills])
      : [];

    // L’API déduit l’entreprise via le token ; la valeur locale est ignorée côté backend
    const entrepriseId = 1;

    return {
      entrepriseId,
      title,
      description,
      location: location || 'Non précisé',
      budget: Number(budget) || 0,
      budgetUnit: contractData.budgetUnit || 'day',
      duration: contractData.duration != null ? Number(contractData.duration) : null,
      durationUnit: contractData.durationUnit || 'jours',
      startDate: contractData.startDate || null,
      requirements: contractData.requirements || '',
      skills: skillsArray,
      deadline: null,
      // mode est déterminé par le flow (direct / publication)
    };
  };

  // ---- Création (pas de redirection ici)
  const createContract = async () => {
    const payload = toServicePayload();
    console.log('[CreationContrat] createContract payload:', { mode, ...payload });

    if (mode === 'direct') {
      if (!selectedFreelance?.id) {
        alert("Sélectionne un freelance pour le mode direct.");
        throw new Error('Freelance manquant');
      }
      const newContract = await contractService.createDirectContract(payload, selectedFreelance.id);
      console.log('[CreationContrat] Contrat direct créé:', newContract);
      setCreatedContract(newContract);
      if (newContract?.id) localStorage.setItem('lastCreatedContractId', String(newContract.id));
      return newContract;
    } else {
      const newContract = await contractService.createPublicationContract(payload);
      console.log('[CreationContrat] Contrat publication créé:', newContract);
      setCreatedContract(newContract);
      if (newContract?.id) localStorage.setItem('lastCreatedContractId', String(newContract.id));
      return newContract;
    }
  };

  // ---- Affichage clair des erreurs backend
  const handleApiError = (err) => {
    const data = err?.response?.data;
    const list =
      Array.isArray(data?.details)
        ? data.details.map(d => `${d.param || d.path}: ${d.msg || d.message}`).join('\n')
        : null;
    const msg = list || data?.error || data?.message || err.message || 'Erreur serveur';
    alert(msg);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Création de contrat</h1>

        {!mode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              onClick={() => selectMode('direct')}
              className="cursor-pointer p-6 bg-white border rounded-lg hover:border-primary shadow-sm"
            >
              <div className="mb-4 text-primary">
                <i className="ri-user-search-line text-3xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sélection directe</h3>
              <p className="text-gray-600 text-sm">
                Choisissez vous-même le freelance parmi les profils disponibles.
              </p>
            </div>
            <div
              onClick={() => selectMode('publication')}
              className="cursor-pointer p-6 bg-white border rounded-lg hover:border-primary shadow-sm"
            >
              <div className="mb-4 text-green-600">
                <i className="ri-broadcast-line text-3xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Publication d'offre</h3>
              <p className="text-gray-600 text-sm">
                Laissez les freelances postuler à votre mission.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Étapes */}
            <div className="flex justify-between items-center mb-6">
              {[...Array(totalSteps)].map((_, i) => {
                const s = i + 1;
                const isActive = step === s;
                const circle = isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500';
                const label =
                  (s === 1 && 'Informations') ||
                  (mode === 'direct' && s === 2 && 'Sélection') ||
                  (((mode === 'publication' && s === 2) || (mode === 'direct' && s === 3)) && 'Paiement') ||
                  (((mode === 'publication' && s === 3) || (mode === 'direct' && s === 4)) && 'Confirmation') ||
                  '';

                return (
                  <div key={s} className={`flex-1 flex flex-col items-center text-sm ${isActive ? 'text-primary font-semibold' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${circle}`}>{s}</div>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Contenu dynamique */}
            <div className="min-h-[300px]">
              {step === 1 && (
                <InformationsStep
                  onNext={nextStep}
                  onCancel={() => setMode(null)}
                  mode={mode}
                  onDataChange={handleDataChange}
                />
              )}

              {step === 2 && mode === 'direct' && (
                <SelectionStep
                  selectedFreelance={selectedFreelance}
                  setSelectedFreelance={setSelectedFreelance}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  contractData={contractData}
                />
              )}

              {step === 2 && mode === 'publication' && (
                <PaiementStepPublication
                  nextStep={async () => {
                    try {
                      console.log('[CreationContrat] Publication > payer/valider -> création…');
                      await createContract();  // crée le contrat
                      nextStep();              // reste dans le wizard
                    } catch (err) {
                      console.error('[CreationContrat] Erreur création (publication):', err);
                      handleApiError(err);
                    }
                  }}
                  prevStep={prevStep}
                  contractData={contractData}
                />
              )}

              {step === 3 && mode === 'direct' && (
                <PaiementStep
                  nextStep={async () => {
                    try {
                      console.log('[CreationContrat] Direct > payer/valider -> création…');
                      await createContract();  // crée le contrat
                      nextStep();              // reste dans le wizard
                    } catch (err) {
                      console.error('[CreationContrat] Erreur création (direct):', err);
                      handleApiError(err);
                    }
                  }}
                  prevStep={prevStep}
                  contractData={contractData}
                  selectedFreelance={selectedFreelance}
                />
              )}

              {step === 3 && mode === 'publication' && (
                <ConfirmationStepPublication
                  contractData={contractData}
                  createdContract={createdContract}
                />
              )}

              {step === 4 && mode === 'direct' && (
                <ConfirmationStep
                  contractData={contractData}
                  selectedFreelance={selectedFreelance}
                  createdContract={createdContract}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreationContrat;