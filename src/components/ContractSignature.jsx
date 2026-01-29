import React, { useState, useRef } from 'react';
import './ContractSignature.css';

/**
 * Composant complet de signature de contrat avec canvas
 */
const ContractSignature = ({
  contrat,
  onSign,
  onCancel,
  loading = false,
  userType = 'freelance',
}) => {
  const [agreed, setAgreed] = useState(false);
  const [signatureType, setSignatureType] = useState('text'); // 'text' ou 'draw'
  const [textSignature, setTextSignature] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Gestion du dessin sur canvas
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;

    let signatureData;
    if (signatureType === 'text') {
      signatureData = { type: 'text', value: textSignature };
    } else {
      const canvas = canvasRef.current;
      signatureData = { type: 'draw', value: canvas?.toDataURL() || '' };
    }

    onSign({
      signature: signatureData,
      agreedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="contract-signature">
      <div className="signature-header">
        <h3>Signature du contrat</h3>
        <p className="contract-title">{contrat?.titre || 'Contrat'}</p>
      </div>

      <div className="signature-details">
        <div className="detail-row">
          <span>Montant:</span>
          <strong>{contrat?.montant?.toLocaleString('fr-FR')} €</strong>
        </div>
        <div className="detail-row">
          <span>Entreprise:</span>
          <strong>{contrat?.entreprise?.raisonSociale || '-'}</strong>
        </div>
        <div className="detail-row">
          <span>Freelance:</span>
          <strong>{contrat?.freelance?.nom} {contrat?.freelance?.prenom || '-'}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="signature-form">
        <div className="signature-type-selector">
          <button
            type="button"
            className={`type-btn ${signatureType === 'text' ? 'active' : ''}`}
            onClick={() => setSignatureType('text')}
          >
            Signature texte
          </button>
          <button
            type="button"
            className={`type-btn ${signatureType === 'draw' ? 'active' : ''}`}
            onClick={() => setSignatureType('draw')}
          >
            Dessiner
          </button>
        </div>

        {signatureType === 'text' ? (
          <div className="form-group">
            <label>Votre signature</label>
            <input
              type="text"
              value={textSignature}
              onChange={(e) => setTextSignature(e.target.value)}
              placeholder="Tapez votre nom complet"
              className="signature-input"
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Dessinez votre signature</label>
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className="signature-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <button type="button" className="btn-clear" onClick={clearCanvas}>
              Effacer
            </button>
          </div>
        )}

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              J'accepte les conditions du contrat et je confirme que cette
              signature electronique a valeur juridique.
            </span>
          </label>
        </div>

        <div className="signature-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!agreed || loading}
          >
            {loading ? 'Signature...' : 'Signer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractSignature;
