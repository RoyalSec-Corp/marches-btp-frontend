import React, { useState, useEffect } from "react";
import {
  RiSearchLine,
  RiStarFill,
  RiStarLine,
  RiGridFill,
  RiListUnordered,
  RiArrowDownSLine,
  RiMapPinRangeLine // 1. Ajout de l'icône distance
} from "react-icons/ri";
import authApi from "../../../services/authApi";
import FreelanceProfileModal from "../../../components/FreelanceProfileModal";
import RechercheGeoConnectee from "../../../components/RechercheGeoConnectee"; // 2. Import du module Géo

const SectionFreelances = () => {
  // --- ÉTATS ---
  const [selectedFreelance, setSelectedFreelance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filtres classiques
  const [tarif, setTarif] = useState(600);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availability, setAvailability] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Gestion des données et affichage
  const [sortOption, setSortOption] = useState("pertinence");
  const [viewMode, setViewMode] = useState("grid");
  const [freelances, setFreelances] = useState([]);
  const [filteredFreelances, setFilteredFreelances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Nouvel état pour savoir si on est en mode GPS
  const [isGeoSearchActive, setIsGeoSearchActive] = useState(false);

  const normalize = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  // Fetch freelances from API
  useEffect(() => {
    loadFreelances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- FONCTIONS ---

  const loadFreelances = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsGeoSearchActive(false); // 4. On désactive la géo si on utilise les filtres classiques
      
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedSpecialty) filters.specialty = normalize(selectedSpecialty);
      if (selectedRegion) filters.region = selectedRegion;
      if (tarif !== undefined && tarif !== null) filters.maxRate = tarif;
      if (availability === "available") filters.availableOnly = 1;
      
      const data = await authApi.getFreelancers(filters);
      setFreelances(data);
      setFilteredFreelances(data);
    } catch (err) {
      setError('Erreur lors du chargement des freelances');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 5. Fonction appelée quand la recherche Géo trouve des résultats
  const handleGeoResults = (results) => {
    setFreelances(results);
    setIsGeoSearchActive(true);
    setSortOption('distance_asc'); // Tri auto par distance
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
    loadFreelances();
  };

  // Filtrer et trier localement
  useEffect(() => {
    let result = [...freelances];
    
    // Appliquer le tri
    switch (sortOption) {
      case 'tarif_asc':
        result.sort((a, b) => (a.daily_rate || a.tarif || 0) - (b.daily_rate || b.tarif || 0));
        break;
      case 'note_desc':
        result.sort((a, b) => (b.note || 0) - (a.note || 0));
        break;
      case 'experience_desc':
        result.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
        break;
      case 'distance_asc': // 6. Nouveau tri par distance
        if (isGeoSearchActive) {
          result.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
        }
        break;
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    setFilteredFreelances(result);
  }, [freelances, sortOption, isGeoSearchActive]);

  // Recharger les données lorsque les filtres changent
  useEffect(() => {
    // 7. Bloquer le rechargement automatique si on est en mode GPS
    if (isGeoSearchActive) return;

    const delayDebounceFn = setTimeout(() => {
      loadFreelances();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedSpecialty, selectedRegion, tarif, availability]);

  const handleSearch = () => {
    loadFreelances();
  };

  // --- RENDER ---
  return (
    <div className="px-6 py-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500">
      <h1 className="text-3xl font-bold text-white mb-1">Auto-entrepreneurs BTP</h1>
      <p className="text-white mb-6">
        Trouvez les meilleurs professionnels indépendants pour vos projets de construction
      </p>

      {/* --- 8. MODULE GÉO INTÉGRÉ --- */}
      <div className="mb-6">
        <RechercheGeoConnectee 
          onResultsFound={handleGeoResults} 
          userType="freelance" 
        />
      </div>

      {/* --- 9. BANNIÈRE INFO GÉO --- */}
      {isGeoSearchActive && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow flex justify-between items-center">
          <div>
            <p className="font-bold">📍 Recherche géographique active</p>
            <p className="text-sm">Freelances triés par proximité.</p>
          </div>
          <button 
            onClick={handleResetSearch}
            className="text-sm underline text-green-800 hover:text-green-900 font-semibold"
          >
            Revenir aux filtres classiques
          </button>
        </div>
      )}

      {/* Filtres de Recherche (Grisés si Géo Active) */}
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 mb-8 transition-opacity ${isGeoSearchActive ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres de Recherche Classiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Spécialités */}
            <div className="relative">
              <select
                className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">Toutes les spécialités</option>
                <option>Plombier</option>
                <option>Menuisier</option>
                <option>Électricien</option>
                <option>Maçon</option>
                <option>Peintre</option>
                <option>Carreleur</option>
                <option>Couvreur</option>
                <option>Chauffagiste</option>
              </select>
              <RiArrowDownSLine className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Régions */}
            <div className="relative">
              <select
                className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">Toutes les régions</option>
                <option>Île-de-France</option>
                <option>Auvergne-Rhône-Alpes</option>
                <option>Nouvelle-Aquitaine</option>
                <option>Occitanie</option>
                <option>Grand-Est</option>
                <option>Provence-Alpes-Côte d'Azur</option>
              </select>
              <RiArrowDownSLine className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Tarif */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Tarif journalier max (€)</label>
              <div className="px-2">
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={tarif}
                  onChange={(e) => setTarif(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0€</span>
                  <span>{tarif}€</span>
                  <span>1000€+</span>
                </div>
              </div>
            </div>

            {/* Évaluation */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Évaluation minimum</label>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <RiStarFill className="text-yellow-400" />
                  <RiStarFill className="text-yellow-400" />
                  <RiStarFill className="text-yellow-400" />
                  <RiStarFill className="text-yellow-400" />
                  <RiStarLine className="text-gray-300" />
                </div>
                <span className="text-sm text-gray-600">4.0+</span>
              </div>
            </div>
          </div>

          {/* Recherche Textuelle */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-64">
              <input
                type="text"
                placeholder="Rechercher par nom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={availability === "available"}
                onChange={(e) => setAvailability(e.target.checked ? "available" : "all")}
              />
              <span>Disponibles uniquement</span>
            </label>
            <button
              className="bg-primary text-white px-6 py-2 rounded-button text-sm hover:bg-blue-600 transition-colors whitespace-nowrap flex items-center space-x-2"
              onClick={handleSearch}
            >
              <RiSearchLine />
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Résultats + Tri */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white font-medium">{freelances.length} freelances trouvés</p>
        <div className="flex items-center gap-4">
          <label className="text-sm text-white">Trier par :</label>
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-900"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="pertinence">Pertinence</option>
            <option value="tarif_asc">Tarif croissant</option>
            <option value="note_desc">Note décroissante</option>
            <option value="experience_desc">Expérience décroissante</option>
            {isGeoSearchActive && <option value="distance_asc">Distance (plus proche)</option>}
          </select>
          <RiGridFill
            className={`cursor-pointer ${viewMode === 'grid' ? 'text-orange-400' : 'text-white'}`}
            onClick={() => setViewMode('grid')}
            size={24}
          />
          <RiListUnordered
            className={`cursor-pointer ${viewMode === 'list' ? 'text-orange-400' : 'text-white'}`}
            onClick={() => setViewMode('list')}
            size={24}
          />
        </div>
      </div>

      {/* Loading and Error Handling */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-2 text-white">Chargement des freelances...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadFreelances}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Cartes freelances */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelances.length === 0 && !loading && (
            <div className="col-span-full text-center py-8">
              <p className="text-white opacity-80">Aucun freelance trouvé</p>
            </div>
          )}
          {filteredFreelances.map((freelance, index) => (
            <div
              key={freelance.id || index}
              className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative"
            >
               {/* Badge de distance si recherche géo */}
               {isGeoSearchActive && freelance.distance && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow flex items-center gap-1 z-10">
                  <RiMapPinRangeLine /> {freelance.distance} km
                </div>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={freelance.avatar_url || freelance.img || "/api/placeholder/40/40"}
                    alt={freelance.nom}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/40/40"; // Fallback image
                    }}
                  />
                  {freelance.disponible || freelance.dispo ? (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  ) : (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{freelance.prenom} {freelance.nom}</h3>
                  <p className="text-sm text-gray-600">{freelance.specialite || freelance.role || 'Professionnel BTP'}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                    <RiStarFill />
                    <span>{freelance.note || freelance.rating || 0}</span>
                    <span className="text-gray-400 ml-2">• {freelance.experience_years || freelance.projets || 0} ans</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Tarif journalier</span>
                  <span className="text-lg font-bold text-primary">{freelance.daily_rate || freelance.tarif || 'N/A'}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Disponibilité</span>
                  {freelance.disponible || freelance.dispo ? (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Disponible
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Occupé
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {freelance.skills && freelance.skills.map((skill, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-300 flex items-center"
                  onClick={() => {
                    setSelectedFreelance(freelance);
                    setIsModalOpen(true);
                  }}
                >
                  <span>Voir profil</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </button>
                <div className="text-xs text-gray-500">
                  {freelance.ville || 'Localisation non spécifiée'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredFreelances.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun freelance trouvé</p>
            </div>
          )}
          {filteredFreelances.map((freelance, index) => (
            <div
              key={freelance.id || index}
              className={`flex items-center justify-between p-4 ${index < filteredFreelances.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={freelance.avatar_url || freelance.img || "/api/placeholder/40/40"}
                    alt={freelance.nom}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/40/40";
                    }}
                  />
                  {freelance.disponible || freelance.dispo ? (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  ) : (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{freelance.prenom} {freelance.nom}</h3>
                  <p className="text-sm text-gray-600">{freelance.specialite || freelance.role || 'Professionnel BTP'}</p>
                  
                  {/* Affichage Distance Liste */}
                  {isGeoSearchActive && freelance.distance && (
                    <div className="flex items-center gap-1 text-green-600 text-xs mt-1 font-bold">
                        <RiMapPinRangeLine /> {freelance.distance} km
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                    <RiStarFill />
                    <span>{freelance.note || freelance.rating || 0}</span>
                    <span className="text-gray-400 ml-1">• {freelance.experience_years || freelance.projets || 0} ans</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{freelance.daily_rate || freelance.tarif || 'N/A'}€/jour</p>
                  <p className="text-xs text-gray-500">{freelance.ville || 'Localisation non spécifiée'}</p>
                </div>
                <button
                  className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    setSelectedFreelance(freelance);
                    setIsModalOpen(true);
                  }}
                >
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal pour le profil du freelance */}
      <FreelanceProfileModal
        freelance={selectedFreelance}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFreelance(null);
        }}
      />
    </div>
  );
};

export default SectionFreelances;