import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenuLine, RiNotification3Line, RiLogoutBoxRLine, RiUserSettingsLine } from 'react-icons/ri';
import { useAuth } from '../../../context/AuthContext'; // Assurez-vous que le chemin est bon

const HeaderAdmin = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // On récupère la fonction du contexte

  const handleLogout = () => {
    // 1. On déconnecte via le contexte (vide le localStorage, met à jour le state)
    if (logout) logout();
    
    // 2. Sécurité supplémentaire : on nettoie tout manuellement
    localStorage.clear();
    sessionStorage.clear();
    
    // 3. Retour à la connexion
    navigate('/connexion-admin');
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Bouton Menu (Mobile) */}
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600 mr-4"
        >
          <RiMenuLine size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
          Tableau de Bord
        </h2>
      </div>

      {/* Actions Droite */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 relative">
          <RiNotification3Line size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* Profil & Déconnexion */}
        <div className="flex items-center border-l pl-4 ml-2 space-x-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-700">Administrateur</p>
            <p className="text-xs text-green-600">En ligne</p>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
             <RiUserSettingsLine size={20} />
          </div>

          {/* 🔴 BOUTON DÉCONNEXION */}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors ml-2"
            title="Se déconnecter"
          >
            <RiLogoutBoxRLine size={20} />
            <span className="hidden md:inline text-sm font-medium">Sortir</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;