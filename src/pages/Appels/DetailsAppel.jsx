import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiSendPlaneFill, RiLockFill, RiCheckDoubleLine, RiErrorWarningLine } from 'react-icons/ri';
import callsForTendersApi from '../../services/callsForTendersApi'; // Assurez-vous du chemin

function DetailsAppel() {
  const { state: appel } = useLocation();
  const navigate = useNavigate();

  // 1. Récupérer l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Etats pour l'interface
  const [activeTab, setActiveTab] = useState('description');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Formulaire de candidature
  const [formData, setFormData] = useState({
    tarif: '',
    days: '',
    motivation: ''
  });

  const onglets = [
    { id: 'description', label: 'Description technique' },
    { id: 'cahier', label: 'Cahier des charges' },
    { id: 'documents', label: 'Documents' },
    { id: 'criteres', label: 'Critères sélection' },
  ];

  // ---------------------------------------------------------
  // 🧠 LOGIQUE DE PERMISSION (Le Cerveau)
  // ---------------------------------------------------------
  const canApply = () => {
    // 1. Si pas connecté
    if (!user || !user.id) return false;

    // 2. Si c'est MON propre appel d'offre, je ne peux pas postuler
    // (Note : appel.entreprise_id vient de la modif BDD qu'on a faite)
    if (user.id === appel.entreprise_id) return false;

    // 3. Si je suis Freelance : TOUT EST PERMIS
    if (user.user_type === 'freelance') return true;

    // 4. Si je suis Entreprise :
    if (user.user_type === 'entreprise') {
      // Je peux postuler SI l'offre vient d'une personne PHYSIQUE (Particulier)
      if (appel.type_personne === 'physique') return true;
      
      // Sinon (Offre Morale / B2B) : INTERDIT
      return false;
    }

    return false;
  };

  // ---------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await callsForTendersApi.applyToCallForTender(appel.id, {
        user_id: user.id,
        motivation: formData.motivation,
        tarif: parseFloat(formData.tarif),
        days: parseInt(formData.days)
      });
      
      alert("✅ Votre candidature a été envoyée avec succès !");
      setShowModal(false);
    } catch (err) {
      alert("❌ Erreur : " + (err.response?.data?.error || "Impossible d'envoyer la candidature"));
    } finally {
      setSubmitting(false);
    }
  };

  const goBackToList = () => {
    navigate('/dashboard-entreprise', { state: { section: 'appels' } });
  };

  return (
    <div className="p-8 relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Détails de l'Appel d'Offre</h1>
        <button onClick={goBackToList} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
          ← Retour
        </button>
      </div>

      {/* CARTE PRINCIPALE */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 relative overflow-hidden">
        {/* Badge Type Personne (Physique vs Morale) */}
        <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold text-white rounded-bl-xl ${appel.type_personne === 'physique' ? 'bg-green-500' : 'bg-purple-600'}`}>
          {appel.type_personne === 'physique' ? '🏠 Particulier' : '🏢 Entreprise'}
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">{appel.titre}</h2>
        <p className="text-gray-600 mb-6">{appel.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 mb-6">
          <p><strong>Budget :</strong> {appel.budget || appel.montant} €</p>
          <p><strong>Durée estimée :</strong> {appel.duree || 'Non spécifiée'}</p>
          <p><strong>Lieu :</strong> {appel.ville || appel.localisation}</p>
          <p><strong>Type :</strong> {appel.type_construction || appel.typeConstruction}</p>
        </div>

        {/* --- ZONE D'ACTION (BOUTON POSTULER) --- */}
        <div className="border-t pt-6 flex items-center justify-end">
          
          {canApply() ? (
            // ✅ CAS 1 : Autorisé (Freelance OU Entreprise sur Particulier)
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center shadow-lg transform hover:-translate-y-1"
            >
              <RiSendPlaneFill className="mr-2" /> Postuler à cette offre
            </button>
          ) : (
            // ❌ CAS 2 : Interdit ou Non Connecté
            <div className="flex items-center text-gray-500 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
              {user.user_type === 'entreprise' && appel.type_personne === 'morale' ? (
                <>
                  <RiLockFill className="mr-2 text-red-500" />
                  <span className="text-sm">
                    <strong>Réservé aux Freelances.</strong> Les entreprises ne peuvent pas sous-traiter ici.
                  </span>
                </>
              ) : (
                <>
                  <RiErrorWarningLine className="mr-2" />
                  <span className="text-sm">Vous ne pouvez pas postuler à cette offre (Auteur ou non connecté).</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ONGLETS (Code existant inchangé) */}
      <div className="mb-4 flex space-x-3 overflow-x-auto pb-2">
        {onglets.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4 min-h-[200px]">
        {activeTab === 'description' && <p className="text-sm text-gray-600">Description technique détaillée...</p>}
        {activeTab === 'cahier' && <p className="text-sm text-gray-600">Cahier des charges...</p>}
        {activeTab === 'documents' && <p className="text-sm text-gray-600">Liste des documents...</p>}
        {activeTab === 'criteres' && <p className="text-sm text-gray-600">Critères de sélection...</p>}
      </div>

      {/* --- MODAL DE CANDIDATURE --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center"><RiSendPlaneFill className="mr-2"/> Ma Candidature</h3>
              <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Votre Tarif Global (€)</label>
                <input 
                  type="number" required 
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Ex: 4500"
                  value={formData.tarif} onChange={e => setFormData({...formData, tarif: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Durée estimée (Jours)</label>
                <input 
                  type="number" required 
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Ex: 15"
                  value={formData.days} onChange={e => setFormData({...formData, days: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Motivation & Approche</label>
                <textarea 
                  required rows="4"
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Expliquez pourquoi vous êtes le meilleur pour ce chantier..."
                  value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Annuler</button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-2 bg-primary text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {submitting ? 'Envoi...' : 'Envoyer ma proposition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default DetailsAppel;