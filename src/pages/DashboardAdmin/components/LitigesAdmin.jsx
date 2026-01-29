import React, { useState, useEffect } from 'react';
import { 
  RiScales3Line, RiAlertLine, RiCheckDoubleLine, RiUserUnfollowLine, 
  RiBuilding4Line, RiUserSmileLine, RiMoneyEuroCircleLine 
} from 'react-icons/ri';
import adminApi from '../../../services/adminApi'; // Vérifiez que le chemin est bon

const LitigesAdmin = () => {
  const [litiges, setLitiges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Charger les vrais litiges depuis la BDD
  useEffect(() => {
    fetchLitiges();
  }, []);

  const fetchLitiges = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getDisputes();
      setLitiges(data);
    } catch (e) { 
      console.error("Erreur chargement litiges", e); 
    } finally {
      setLoading(false);
    }
  };

  // 2. Action du Juge (Résoudre)
  const handleResolve = async (decision) => {
    if(!window.confirm(`Confirmer la décision finale : "${decision}" ? \nCette action est irréversible.`)) return;
    
    try {
      await adminApi.resolveDispute(selected.id, decision);
      alert("✅ Affaire classée.");
      fetchLitiges(); // Rafraîchir la liste
      setSelected(null); // Fermer le dossier
    } catch (e) { 
      alert("Erreur lors de la résolution"); 
    }
  };

  // Helper pour afficher le nom (Entreprise ou Particulier)
  const formatName = (org, pre, nom) => {
    if (org) return org.toUpperCase(); // Si entreprise
    if (pre && nom) return `${pre} ${nom}`;
    return "Utilisateur Inconnu";
  };

  return (
    <div className="flex h-[600px] gap-6 animate-fadeIn font-sans">
      
      {/* --- COLONNE GAUCHE : LISTE DES DOSSIERS --- */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <h3 className="font-bold text-gray-800 flex items-center">
            <RiScales3Line className="mr-2 text-red-600"/> Tribunal ({litiges.filter(l => l.status === 'en cours' || l.status === 'ouvert').length} en cours)
          </h3>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {loading ? (
            <p className="text-center text-xs text-gray-400 mt-10">Chargement des dossiers...</p>
          ) : litiges.length === 0 ? (
            <div className="text-center text-gray-400 text-sm mt-10 p-4">
              Aucun litige en cours.<br/>Tout va bien ! 🎉
            </div>
          ) : (
            litiges.map(l => (
              <div 
                key={l.id} 
                onClick={() => setSelected(l)}
                className={`p-3 rounded-lg cursor-pointer border transition-all hover:shadow-md ${selected?.id === l.id ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex justify-between mb-1">
                  <span className={`text-[10px] px-2 rounded-full uppercase font-bold ${l.status === 'resolu' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {l.status}
                  </span>
                  <span className="text-[10px] text-gray-400">{new Date(l.created_at).toLocaleDateString()}</span>
                </div>
                <p className="font-bold text-sm text-gray-800 line-clamp-1">{l.motif}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                   <span>Par: {formatName(l.plaignant_org, l.plaignant_pre, l.plaignant_nom)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- COLONNE DROITE : DÉTAILS DU DUEL --- */}
      <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center relative">
        {selected ? (
          <div className="h-full flex flex-col">
            
            {/* Header Conflit */}
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                   <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <RiAlertLine className="text-orange-500 mr-2"/> {selected.motif}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Dossier #{selected.id} • Ouvert le {new Date(selected.created_at).toLocaleDateString()}</p>
                </div>
                {/* Info Contrat */}
                {selected.contrat_titre && (
                  <div className="text-right bg-blue-50 px-3 py-2 rounded border border-blue-100">
                    <p className="text-[10px] text-blue-500 font-bold uppercase">Contrat lié</p>
                    <p className="text-xs font-bold text-gray-700 truncate w-32">{selected.contrat_titre}</p>
                    <p className="text-xs text-green-600 font-bold flex justify-end items-center mt-1">
                      <RiMoneyEuroCircleLine className="mr-1"/> {selected.contrat_montant} €
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Le Duel (Gauche vs Droite) */}
            <div className="flex-1 grid grid-cols-2 gap-8 relative items-start mt-4">
              
              {/* Le Plaignant (Celui qui attaque) */}
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 relative h-full">
                <div className="absolute -top-3 left-4 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase shadow-sm">Plaignant</div>
                <div className="flex items-center mb-4 mt-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-red-200 flex items-center justify-center text-red-600 mr-3 shadow-sm">
                    {selected.plaignant_type === 'entreprise' ? <RiBuilding4Line/> : <RiUserSmileLine/>}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{formatName(selected.plaignant_org, selected.plaignant_pre, selected.plaignant_nom)}</p>
                    <p className="text-xs text-gray-500">{selected.plaignant_email}</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-red-100 text-sm text-gray-700 italic shadow-sm relative">
                  <span className="absolute -top-2 left-2 text-2xl text-red-200">"</span>
                  {selected.description}
                </div>
              </div>

              {/* L'Accusé (Celui qui se défend) */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative h-full">
                <div className="absolute -top-3 right-4 bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase shadow-sm">Accusé</div>
                <div className="flex items-center mb-4 mt-2 justify-end text-right">
                  <div className="mr-3">
                    <p className="font-bold text-sm text-gray-800">{formatName(selected.accuse_org, selected.accuse_pre, selected.accuse_nom)}</p>
                    <p className="text-xs text-gray-500">{selected.accuse_email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 shadow-sm">
                    {selected.accuse_type === 'entreprise' ? <RiBuilding4Line/> : <RiUserSmileLine/>}
                  </div>
                </div>
                <div className="text-center mt-6 text-xs text-gray-400 italic flex flex-col items-center">
                  <RiUserUnfollowLine className="text-2xl mb-2 opacity-30"/>
                  Pas de réponse enregistrée pour l'instant.
                </div>
              </div>
              
              {/* VS Icone au milieu */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 border-2 border-gray-100 shadow-sm z-10 font-black text-gray-300 text-lg">VS</div>
            </div>

            {/* Actions de Juge */}
            {selected.status !== 'resolu' ? (
              <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-3">
                <button onClick={() => handleResolve('Remboursement Client')} className="bg-white border border-red-200 text-red-600 py-3 rounded-lg font-bold text-xs hover:bg-red-600 hover:text-white transition shadow-sm flex flex-col items-center justify-center">
                  <span>⚖️ Gagnant : Client</span>
                  <span className="text-[10px] font-normal opacity-70">Remboursement</span>
                </button>
                <button onClick={() => handleResolve('Paiement Freelance')} className="bg-white border border-green-200 text-green-600 py-3 rounded-lg font-bold text-xs hover:bg-green-600 hover:text-white transition shadow-sm flex flex-col items-center justify-center">
                  <span>⚖️ Gagnant : Freelance</span>
                  <span className="text-[10px] font-normal opacity-70">Débloquer fonds</span>
                </button>
                <button onClick={() => handleResolve('Compromis 50/50')} className="bg-white border border-blue-200 text-blue-600 py-3 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition shadow-sm flex flex-col items-center justify-center">
                  <span>🤝 Médiation</span>
                  <span className="text-[10px] font-normal opacity-70">50 / 50</span>
                </button>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center flex flex-col items-center justify-center">
                <div className="flex items-center text-green-700 font-bold mb-1">
                   <RiCheckDoubleLine className="mr-2 text-xl"/> Affaire classée
                </div>
                <p className="text-sm text-green-600 font-medium">Verdict : {selected.decision}</p>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center opacity-40">
            <RiScales3Line className="text-7xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Sélectionnez un dossier de litige</p>
            <p className="text-sm text-gray-400">Pour examiner les preuves et rendre un jugement.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LitigesAdmin;