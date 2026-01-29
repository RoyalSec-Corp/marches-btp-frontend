import React from 'react';
import './ContractProgressTracker.css';

/**
 * Composant de suivi de progression des contrats
 */
const ContractProgressTracker = ({ contrat, stages = null }) => {
  // Etapes par defaut du contrat
  const defaultStages = [
    { key: 'BROUILLON', label: 'Brouillon', icon: '📝' },
    { key: 'EN_ATTENTE', label: 'En attente', icon: '⏳' },
    { key: 'SIGNE', label: 'Signe', icon: '✍️' },
    { key: 'EN_COURS', label: 'En cours', icon: '🔄' },
    { key: 'TERMINE', label: 'Termine', icon: '✅' },
  ];

  const currentStages = stages || defaultStages;
  const currentStatus = contrat?.statut || 'BROUILLON';

  // Trouver l'index du statut actuel
  const currentIndex = currentStages.findIndex((s) => s.key === currentStatus);

  // Gestion des statuts speciaux
  const isAnnule = currentStatus === 'ANNULE';
  const isLitige = currentStatus === 'LITIGE';

  const getStepClass = (index) => {
    if (isAnnule || isLitige) {
      return index <= currentIndex ? 'step-error' : 'step-pending';
    }
    if (index < currentIndex) return 'step-completed';
    if (index === currentIndex) return 'step-current';
    return 'step-pending';
  };

  return (
    <div className="contract-progress-tracker">
      <div className="progress-header">
        <h4>Progression du contrat</h4>
        {isAnnule && <span className="status-badge status-cancelled">Annule</span>}
        {isLitige && <span className="status-badge status-dispute">Litige</span>}
      </div>

      <div className="progress-steps">
        {currentStages.map((stage, index) => (
          <div key={stage.key} className={`progress-step ${getStepClass(index)}`}>
            <div className="step-indicator">
              <span className="step-icon">{stage.icon}</span>
              {index < currentStages.length - 1 && <div className="step-line" />}
            </div>
            <div className="step-content">
              <span className="step-label">{stage.label}</span>
              {index === currentIndex && !isAnnule && !isLitige && (
                <span className="step-current-badge">Actuel</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {contrat?.progressStage && (
        <div className="progress-details">
          <p className="progress-note">{contrat.progressStage}</p>
        </div>
      )}
    </div>
  );
};

export default ContractProgressTracker;
