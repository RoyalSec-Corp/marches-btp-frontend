// src/pages/DashboardAdmin/components/ScrappingAdmin.jsx
import React, { useState } from 'react';
import axios from 'axios'; 
import { 
  RiRobot2Line, 
  RiDownloadCloud2Line, 
  RiLoader4Line, 
  RiAddCircleLine, 
  RiGlobalLine 
} from 'react-icons/ri';

// ✅ CORRECTION MAJEURE : Port 3001 (Le même que votre server.js)
const API_URL = 'http://localhost:3002/api';

const ScrappingAdmin = () => {
  const [activeTab, setActiveTab] = useState('auto'); // 'auto' ou 'manual'
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState([]);

  // Formulaire pour l'import manuel
  const [manualForm, setManualForm] = useState({
    url: '',
    titre: '',
    description: '',
    budget: '',
    ville: '',
    type_personne: 'physique' // Par défaut : Particulier
  });

  // --- ACTION 1 : ROBOT AUTO ---
  const startScrapping = async () => {
    if (loading) return;
    
    setLoading(true);
    setLogs(["🔄 Initialisation du robot multi-sources...", "🌍 Connexion aux sites BTP..."]);
    setResults([]);

    try {
      // Simulation d'attente pour l'UX (React 18 gère très bien ce timeout)
      setTimeout(async () => {
        setLogs(prev => [...prev, "🔎 Identification : Chantiers Particuliers & Missions Pro...", "📥 Téléchargement des données..."]);
        
        try {
          // Appel réel au backend
          const res = await axios.post(`${API_URL}/admin/scrape/trigger`);
          
          // React 18 va "batcher" (grouper) ces mises à jour en un seul rendu
          setLogs(prev => [...prev, "✅ Traitement terminé.", `🚀 ${res.data.message}`]);
          setResults(res.data.data);
        } catch (serverErr) {
          console.error(serverErr);
          setLogs(prev => [...prev, `❌ ERREUR API : ${serverErr.response?.data?.error || serverErr.message}`]);
        } finally {
          setLoading(false);
        }
      }, 2000);

    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "❌ ERREUR CRITIQUE : Le script a échoué."]);
      setLoading(false);
    }
  };

  // --- ACTION 2 : IMPORT MANUEL ---
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/scrape/manual`, manualForm);
      
      alert("✅ Offre ajoutée avec succès !");
      
      // Réinitialisation propre
      setManualForm({ url: '', titre: '', description: '', budget: '', ville: '', type_personne: 'physique' });
      
    } catch (err) {
      console.error(err);
      alert(`❌ Erreur : ${err.response?.data?.error || "Impossible de joindre le serveur (Vérifiez le port 3001)"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
      
      {/* En-tête */}
      <div className="flex items-center mb-8 text-blue-900 border-b pb-4">
        <RiGlobalLine className="text-4xl mr-3 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Centre d'Importation d'Offres</h1>
          <p className="text-gray-500 text-sm">Centralisez les appels d'offres du web (LeBonCoin, Travaux.com, FranceMarchés...)</p>
        </div>
      </div>

      {/* Boutons d'onglets (Tabs) */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('auto')}
          className={`px-6 py-2 rounded-lg font-bold flex items-center transition-all ${
            activeTab === 'auto' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <RiRobot2Line className="mr-2" /> Robot Automatique
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-6 py-2 rounded-lg font-bold flex items-center transition-all ${
            activeTab === 'manual' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <RiAddCircleLine className="mr-2" /> Import Manuel (URL)
        </button>
      </div>

      {/* --- CONTENU ONGLET 1 : ROBOT AUTO --- */}
      {activeTab === 'auto' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          
          {/* Panneau de contrôle (Gauche) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-bold text-lg mb-4 text-blue-900">Lancer le Scrapping</h3>
              <p className="text-sm text-blue-800 mb-6 leading-relaxed">
                Le robot va récupérer des offres mixtes :
                <br/><span className="mt-2 block">• 🏠 <strong>Physique</strong> (Pour Artisans)</span>
                <span className="block">• 🏢 <strong>Morale</strong> (Pour Freelances)</span>
              </p>
              
              <button
                onClick={startScrapping}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-bold text-white shadow-md flex items-center justify-center transition-all ${
                  loading ? 'bg-gray-400 cursor-wait' : 'bg-primary hover:bg-blue-700 hover:scale-[1.02]'
                }`}
              >
                {loading ? <RiLoader4Line className="animate-spin mr-2 text-xl"/> : <RiDownloadCloud2Line className="mr-2 text-xl"/>}
                {loading ? 'Traitement...' : 'Lancer Importation'}
              </button>
            </div>
          </div>

          {/* Terminal & Résultats (Droite) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Terminal Noir */}
            <div className="bg-gray-900 text-green-400 p-6 rounded-xl shadow-inner font-mono text-sm h-64 overflow-y-auto border border-gray-700">
              <p className="opacity-50 mb-2">root@scrapper-bot:~# waiting for command...</p>
              {logs.map((log, index) => <p key={index} className="mb-1 border-l-2 border-green-600 pl-2"> {log}</p>)}
            </div>
            
            {/* Liste des résultats */}
            {results.length > 0 && (
              <div className="bg-white rounded-xl shadow border border-green-200 overflow-hidden">
                <div className="bg-green-50 p-3 border-b border-green-100 font-bold text-green-800 text-sm">
                  Derniers résultats importés
                </div>
                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                  {results.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center hover:bg-gray-50">
                      <div>
                        <span className="font-semibold text-gray-800 text-sm block">{item.titre}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.type_personne === 'physique' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                           {item.type_personne === 'physique' ? '🏠 Particulier' : '🏢 Entreprise'}
                        </span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Ajouté</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CONTENU ONGLET 2 : IMPORT MANUEL --- */}
      {activeTab === 'manual' && (
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 animate-fadeIn max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <RiAddCircleLine className="mr-2"/> Ajouter une offre spécifique
          </h3>
          
          <form onSubmit={handleManualSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-sm">
            
            {/* URL Source */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL de l'offre originale</label>
              <input 
                type="url" required 
                placeholder="https://www.leboncoin.fr/offres/..."
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary outline-none transition"
                value={manualForm.url} onChange={e => setManualForm({...manualForm, url: e.target.value})}
              />
            </div>

            {/* Titre & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Titre de l'offre</label>
                <input 
                  type="text" required 
                  placeholder="Ex: Rénovation salle de bain"
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary outline-none"
                  value={manualForm.titre} onChange={e => setManualForm({...manualForm, titre: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Budget (€)</label>
                 <input 
                  type="number" 
                  placeholder="Ex: 5000"
                  className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary outline-none"
                  value={manualForm.budget} onChange={e => setManualForm({...manualForm, budget: e.target.value})}
                />
              </div>
            </div>

            {/* Cible (Radio Buttons) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cible (Qui peut répondre ?)</label>
              <div className="flex space-x-4">
                <label className={`flex items-center cursor-pointer p-3 border rounded-lg w-full transition ${manualForm.type_personne === 'physique' ? 'border-primary bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <input 
                    type="radio" name="cible" value="physique"
                    checked={manualForm.type_personne === 'physique'}
                    onChange={() => setManualForm({...manualForm, type_personne: 'physique'})}
                    className="mr-3 w-4 h-4 text-primary"
                  />
                  <div>
                    <span className="font-bold block text-gray-800">🏠 Particulier</span>
                    <span className="text-xs text-gray-500">L'offre ira dans "Trouver un chantier" (Pour Entreprises)</span>
                  </div>
                </label>

                <label className={`flex items-center cursor-pointer p-3 border rounded-lg w-full transition ${manualForm.type_personne === 'morale' ? 'border-primary bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <input 
                    type="radio" name="cible" value="morale"
                    checked={manualForm.type_personne === 'morale'}
                    onChange={() => setManualForm({...manualForm, type_personne: 'morale'})}
                    className="mr-3 w-4 h-4 text-primary"
                  />
                  <div>
                    <span className="font-bold block text-gray-800">🏢 Entreprise (B2B)</span>
                    <span className="text-xs text-gray-500">L'offre ira dans "Missions Freelance" (Pour Freelances)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Détails</label>
              <textarea 
                rows="4" required 
                placeholder="Copiez ici la description complète..."
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary outline-none"
                value={manualForm.description} onChange={e => setManualForm({...manualForm, description: e.target.value})}
              ></textarea>
            </div>

            {/* Ville */}
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ville</label>
               <input 
                type="text" required 
                placeholder="Ex: Paris"
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-primary outline-none"
                value={manualForm.ville} onChange={e => setManualForm({...manualForm, ville: e.target.value})}
              />
            </div>

            {/* Bouton Submit */}
            <div className="pt-4 text-right border-t">
              <button 
                type="submit" disabled={loading}
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg transform active:scale-95"
              >
                {loading ? 'Ajout en cours...' : '✅ Ajouter à la Plateforme'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ScrappingAdmin;