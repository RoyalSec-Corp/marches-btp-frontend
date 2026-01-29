import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RiPlayLine, 
  RiAddCircleLine, 
  RiFileList3Line, 
  RiExternalLinkLine,
  RiLoader4Line
} from 'react-icons/ri';

// URL API (Port 3002)
const API_URL = 'http://localhost:3002/api';

function ScrapingSources({ onViewDetails }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les dernières offres au montage du composant
  useEffect(() => {
    fetchScrapedOffers();
  }, []);

  const fetchScrapedOffers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/scraped-latest`);
      setOffers(res.data);
    } catch (err) {
      console.error("Erreur chargement widget scraping", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full flex flex-col">
      
      {/* --- EN-TÊTE DU WIDGET --- */}
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div className="flex items-center space-x-2">
          <RiFileList3Line className="text-blue-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Derniers Imports</h3>
        </div>
        <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-green-700">Live</span>
        </div>
      </div>

      {/* --- LISTE DÉROULANTE (SCROLLABLE) --- */}
      <div className="flex-grow overflow-y-auto max-h-[250px] pr-1 space-y-2 custom-scrollbar">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <RiLoader4Line className="animate-spin text-2xl mb-2" />
            <span className="text-sm">Chargement...</span>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg">
            Aucune offre importée récemment.
            <br />
            Lancez le robot pour commencer !
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="group p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800 text-sm line-clamp-1" title={offer.titre}>
                  {offer.titre}
                </h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  offer.type_personne === 'physique' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {offer.type_personne === 'physique' ? 'B2C' : 'B2B'}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500 flex items-center">
                  <span className="truncate max-w-[80px]">{offer.ville}</span>
                  <span className="mx-1">•</span>
                  <span className="font-medium text-green-600">{offer.budget} €</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  {new Date(offer.date_creation).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- PIED DE PAGE : ACTIONS --- */}
      <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
        {/* Bouton pour rafraîchir la liste (optionnel, ou lien vers détails) */}
        <button 
          onClick={fetchScrapedOffers}
          className="flex items-center justify-center px-3 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
           Actualiser
        </button>

        {/* Bouton principal : AJOUTER / CONFIGURER */}
        <button 
          onClick={onViewDetails}
          className="flex items-center justify-center px-3 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <RiAddCircleLine className="mr-1 text-sm"/> Ajouter / Configurer
        </button>
      </div>
    </div>
  );
}

export default ScrapingSources;