import React, { useState, useEffect } from 'react';
import { 
  RiSearchLine, RiDeleteBinLine, RiEditLine, RiFileListLine, 
  RiUserSmileLine, RiBuilding4Line, RiCheckLine, RiCloseLine, 
  RiMegaphoneLine, RiArrowLeftLine, RiEyeLine // Ajout de l'icône Mégaphone pour les AO
} from 'react-icons/ri';
import adminApi from '../../../services/adminApi';

const GestionUtilisateurs = ({ mode = 'widget', users: initialUsers = [] }) => {
  
  // --- ÉTATS ---
  const [query, setQuery] = useState('');
  const [usersList, setUsersList] = useState(initialUsers);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // États Édition & Activité
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [viewActivity, setViewActivity] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // --- 🎨 FONCTION DE STYLE INTELLIGENTE ---
  // C'est elle qui gère les 3 COULEURS (Violet, Orange, Rouge)
  const getTypeConfig = (type) => {
    switch (type) {
      case 'freelance':
        return { 
          label: 'Freelance', 
          color: 'bg-purple-100 text-purple-700', 
          icon: <RiUserSmileLine />,
          borderColor: 'border-purple-200'
        };
      case 'entreprise':
        return { 
          label: 'Entreprise', 
          color: 'bg-orange-100 text-orange-700', 
          icon: <RiBuilding4Line />,
          borderColor: 'border-orange-200'
        };
      case 'ao_individu':
      case 'ao_societe':
      default: // Par défaut, on considère que c'est un porteur de projet/AO
        return { 
          label: "Porteur d'Offre", 
          color: 'bg-red-100 text-red-700', 
          icon: <RiMegaphoneLine />,
          borderColor: 'border-red-200'
        };
    }
  };

  // Charger la liste complète
  useEffect(() => {
    if (mode === 'table') {
      const loadAllUsers = async () => {
        try {
          const data = await adminApi.getAllUsers();
          setUsersList(data);
        } catch (e) { console.error(e); }
      };
      loadAllUsers();
    }
  }, [mode]);

  // --- LOGIQUE RECHERCHE ---
  const handleSearch = async (e) => {
    const text = e.target.value;
    setQuery(text);
    if (text.length > 1) {
      setLoading(true);
      try {
        const data = await adminApi.searchUsers(text);
        setSearchResults(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      nom_entreprise: user.nom_entreprise || ''
    });
    setSearchResults([]); 
    setQuery('');
    setEditMode(false);
    setViewActivity(false);
  };

  // --- ACTIONS ---
  const handleUpdate = async () => {
    try {
      await adminApi.updateUser(selectedUser.id, formData);
      alert("✅ Modifié avec succès !");
      setEditMode(false);
      const updatedUser = { ...selectedUser, ...formData };
      setSelectedUser(updatedUser);
      // Mise à jour de la liste locale
      setUsersList(usersList.map(u => u.id === updatedUser.id ? updatedUser : u));
    } catch (err) { alert("❌ Erreur modification"); }
  };

  const handleShowActivity = async () => {
    setViewActivity(true);
    setLoadingActivity(true);
    try {
      const data = await adminApi.getUserActivity(selectedUser.id);
      setActivityData(data);
    } catch (err) { console.error(err); } 
    finally { setLoadingActivity(false); }
  };

  const handleDelete = async () => {
    if (window.confirm(`Supprimer définitivement cet utilisateur ?`)) {
      await adminApi.deleteUser(selectedUser.id);
      setUsersList(usersList.filter(u => u.id !== selectedUser.id));
      setSelectedUser(null);
    }
  };

  // --- RENDU DÉTAIL ---
  const renderUserDetail = () => {
    const typeConfig = getTypeConfig(selectedUser.user_type);

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header Fiche */}
        <div className="flex justify-between items-start mb-4 pb-2 border-b border-gray-100">
             {viewActivity ? (
                <button onClick={() => setViewActivity(false)} className="flex items-center text-xs text-gray-500 hover:text-primary">
                    <RiArrowLeftLine className="mr-1"/> Retour Fiche
                </button>
             ) : (
                <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-2 ${typeConfig.color}`}>
                        {typeConfig.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm">{selectedUser.nom_entreprise || `${selectedUser.prenom} ${selectedUser.nom}`}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeConfig.color}`}>
                            {typeConfig.label}
                        </span>
                    </div>
                </div>
             )}
             <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-red-500"><RiCloseLine size={20} /></button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto pr-1">
             {viewActivity ? (
                <div className="space-y-2">
                   {loadingActivity ? <p className="text-xs text-gray-400">Chargement...</p> : activityData.length > 0 ? (
                       activityData.map((item, i) => (
                          <div key={i} className="flex items-start p-2 border border-gray-50 rounded bg-gray-50/50">
                             <div className={`mt-1 w-2 h-2 rounded-full mr-2 ${item.type === 'contrat' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                             <div>
                                <p className="text-xs font-bold text-gray-700">{item.type.toUpperCase()}</p>
                                <p className="text-sm text-gray-800">{item.label}</p>
                                <p className="text-[10px] text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                             </div>
                          </div>
                       ))
                   ) : <p className="text-xs text-gray-400 italic">Aucune activité récente.</p>}
                </div>
             ) : (
                <div className="space-y-3">
                   {/* Nom Entreprise affiché pour Entreprises ET Appels d'offres (si applicable) */}
                   {(selectedUser.user_type === 'entreprise' || selectedUser.user_type === 'ao_societe') && (
                       <div><label className="text-[10px] font-bold text-gray-400">STRUCTURE</label>
                       <input disabled={!editMode} value={formData.nom_entreprise} onChange={(e) => setFormData({...formData, nom_entreprise: e.target.value})} className={`w-full text-sm p-1 border-b ${editMode ? 'border-primary bg-blue-50/50' : 'border-transparent'}`}/></div>
                   )}
                   <div className="grid grid-cols-2 gap-2">
                       <div><label className="text-[10px] font-bold text-gray-400">PRÉNOM</label>
                       <input disabled={!editMode} value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className={`w-full text-sm p-1 border-b ${editMode ? 'border-primary bg-blue-50/50' : 'border-transparent'}`}/></div>
                       <div><label className="text-[10px] font-bold text-gray-400">NOM</label>
                       <input disabled={!editMode} value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className={`w-full text-sm p-1 border-b ${editMode ? 'border-primary bg-blue-50/50' : 'border-transparent'}`}/></div>
                   </div>
                   <div><label className="text-[10px] font-bold text-gray-400">EMAIL</label>
                   <input disabled={!editMode} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full text-sm p-1 border-b ${editMode ? 'border-primary bg-blue-50/50' : 'border-transparent'}`}/></div>
                </div>
             )}
        </div>

        {!viewActivity && (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
             <button onClick={editMode ? handleUpdate : () => setEditMode(true)} className={`p-2 rounded flex flex-col items-center ${editMode ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {editMode ? <RiCheckLine/> : <RiEditLine/>} <span className="text-[10px]">{editMode ? 'Sauver' : 'Modifier'}</span>
             </button>
             <button onClick={handleShowActivity} className="p-2 rounded text-blue-600 hover:bg-blue-50 flex flex-col items-center"><RiFileListLine/> <span className="text-[10px]">Activité</span></button>
             <button onClick={handleDelete} className="p-2 rounded text-red-500 hover:bg-red-50 flex flex-col items-center"><RiDeleteBinLine/> <span className="text-[10px]">Suppr.</span></button>
          </div>
        )}
      </div>
    );
  };

  // --- RENDU TABLEAU ---
  if (mode === 'table') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <RiBuilding4Line className="mr-2"/> Gestion des Utilisateurs ({usersList.length})
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Utilisateur</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Inscrit le</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersList.map((user) => {
                const typeConfig = getTypeConfig(user.user_type);
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-800">{user.nom_entreprise || `${user.prenom} ${user.nom}`}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center w-fit gap-1 px-2 py-1 rounded-full text-[10px] uppercase font-bold ${typeConfig.color}`}>
                        {typeConfig.icon}
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">{user.ville || '-'}</td>
                    <td className="px-4 py-3 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleSelectUser(user)} className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-primary hover:text-white transition-all shadow-sm text-xs font-medium">
                         <RiEyeLine/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MODALE ÉDITION */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md h-[500px] overflow-hidden relative border-t-4 ${getTypeConfig(selectedUser.user_type).borderColor}`}>
               <div className="p-6 h-full">{renderUserDetail()}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- RENDU WIDGET ---
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col relative">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center"><RiSearchLine className="mr-2 text-primary" /> Recherche Rapide</h3>
      {!selectedUser && (
        <div className="relative mb-4">
            <input type="text" className="w-full border p-2 rounded text-sm" placeholder="Nom, Email, Entreprise..." value={query} onChange={handleSearch} />
            {loading && <div className="absolute right-3 top-3 animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>}
            {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border shadow-xl z-10 max-h-48 overflow-y-auto rounded-b-lg">
                {searchResults.map(u => {
                   const conf = getTypeConfig(u.user_type);
                   return (
                    <div key={u.id} onClick={() => handleSelectUser(u)} className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b flex justify-between items-center">
                        <span className="font-medium text-gray-700">{u.nom_entreprise || `${u.prenom} ${u.nom}`}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${conf.color}`}>{conf.label}</span>
                    </div>
                   );
                })}
            </div>
            )}
        </div>
      )}
      {selectedUser ? renderUserDetail() : <div className="flex-1 flex items-center justify-center text-gray-300 text-xs italic">Sélectionnez un utilisateur</div>}
    </div>
  );
};

export default GestionUtilisateurs;