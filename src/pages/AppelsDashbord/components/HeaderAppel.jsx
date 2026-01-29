import React from 'react';
import { RiNotificationLine, RiAddLine, RiGiftLine, RiLogoutBoxRLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom'; // ✅ Import
import authService from '../../../services/authService';

function HeaderAppel({ activeSection, setActiveSection }) {
  const navigate = useNavigate(); // ✅ Hook de navigation

  const handleClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div>
      {/* NAVIGATION */}
      <nav className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + menu */}
            <div className="flex items-center space-x-8">
              <div className="font-['Pacifico'] text-2xl text-white">Marchés BTP</div>
              <div className="hidden md:flex space-x-6 text-white">
                {["dashboard", "freelances", "entreprises", "messages", "candidatures","paiement", "parrainage"].map((section) => (
                  <button
                    key={section}
                    onClick={() => handleClick(section)}
                    className={`px-4 py-2 rounded-button transition-colors flex items-center space-x-1 ${
                      activeSection === section
                        ? 'text-primary bg-blue-50 font-medium'
                        : 'text-white-600 hover:text-primary'
                    }`}
                  >
                    {section === 'parrainage' && <RiGiftLine className="w-4 h-4" />}
                    <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                  </button>
                ))}

                {/* Bouton de déconnexion */}
                  <button
                    onClick={() => authService.logout('/')}
                    className="mt-2 flex items-center w-full px-4 py-3 rounded-lg font-medium text-sm text-red-600 hover:text-white hover:bg-red-500 transition-all" >
                    <RiLogoutBoxRLine className="w-5 h-5 mr-3" />
                     Déconnexion
                  </button>  
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-white hover:text-primary transition-colors">
                <RiNotificationLine className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <button
                onClick={() => navigate('/appel-offre')} // ✅ Redirection vers la page
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-300 hover:to-blue-500 transition-all duration-300 whitespace-nowrap text-white px-6 py-2 rounded-button font-medium transition-colors whitespace-nowrap flex items-center space-x-2"
              >
                <RiAddLine className="w-4 h-4" />
                <span>Créer un appel d'offre</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* TITRE SECTION */}
      {activeSection === "dashboard" && (
        <div className="px-6 py-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard des Appels d'Offres
          </h1>
          <p className="text-white">
            Gérez vos projets et suivez vos performances en temps réel
          </p>
        </div>
      )}
    </div>
  );
}

export default HeaderAppel;
