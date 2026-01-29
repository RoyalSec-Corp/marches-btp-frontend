import React, { useState } from 'react';
import './ContractSignature.css';

/**
 * Composant simplifie de signature de contrat
 */
const ContractSignatureSimple = ({
  contrat,
  onSign,
  onCancel,
  loading = false,
  userType = 'freelance',
}) => {
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreed && signature.trim()) {
      onSign({ signature, agreedAt: new Date().toISOString() });
    }
  };

  return (
    <div className="contract-signature-simple">
      <div className="signature-header">
        <h3>Signature du contrat</h3>
        <p className="contract-title">{contrat?.titre || 'Contrat'}</p>
      </div>

      <div className="signature-summary">
        <div className="summary-item">
          <span className="label">Montant:</span>
          <span className="value">{contrat?.montant?.toLocaleString('fr-FR')} €</span>
        </div>
        <div className="summary-item">
          <span className="label">Date debut:</span>
          <span className="value">
            {contrat?.dateDebut
              ? new Date(contrat.dateDebut).toLocaleDateString('fr-FR')
              : 'A definir'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="signature-form">
        <div className="form-group">
          <label htmlFor="signature">Votre signature (nom complet)</label>
          <input
            type="text"
            id="signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Tapez votre nom complet"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading}
            />
            <span>
              J'ai lu et j'accepte les termes du contrat. Je comprends que cette
              signature electronique a valeur legale.
            </span>
          </label>
        </div>

        <div className="signature-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!agreed || !signature.trim() || loading}
          >
            {loading ? 'Signature en cours...' : 'Signer le contrat'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractSignatureSimple;
