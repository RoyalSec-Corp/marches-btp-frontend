import React, { useState, useEffect } from "react";
import {
  RiSearchLine,
  RiStarFill,
  RiGridFill,
  RiListUnordered,
  RiArrowDownSLine,
  RiBuilding2Line,
  RiMapPinRangeLine // 1. Ajout de l'icône distance
} from "react-icons/ri";
import authApi from "../../../services/authApi";
import RechercheGeoConnectee from "../../../components/RechercheGeoConnectee"; // 2. Import du module Géo

const SectionEntreprises = () => {
  // --- ÉTATS ---
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("pertinence");
  const [viewMode, setViewMode] = useState("grid");
  const [entreprises, setEntreprises] = useState([]);
  const [filteredEntreprises, setFilteredEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Nouvel état pour la recherche géo
  const [isGeoSearchActive, setIsGeoSearchActive] = useState(false);

  // Fetch entreprises from API (Chargement initial)
  useEffect(() => {
    loadEntreprises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- FONCTIONS ---

  const loadEntreprises = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsGeoSearchActive(false); // On désactive la géo si on recharge via filtres classiques
      
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedSector) filters.sector = selectedSector;
      if (selectedRegion) filters.region = selectedRegion;
      if (selectedSize) filters.size = selectedSize;
      
      const data = await authApi.getEntreprises(filters);
      setEntreprises(data);
    } catch (err) {
      setError('Erreur lors du chargement des entreprises');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Fonction pour gérer les résultats GPS
  const handleGeoResults = (results) => {
    setEntreprises(results);
    setIsGeoSearchActive(true);
    setSortOption('distance_asc'); // Tri auto par distance
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setSelectedSector("");
    loadEntreprises();
  };

  // Filtrer et trier localement
  useEffect(() => {
    let result = [...entreprises];
    
    // Appliquer le tri
    switch (sortOption) {
      case 'localisation':
        result.sort((a, b) => (a.ville || '').localeCompare(b.ville || ''));
        break;
      case 'projets_desc':
        result.sort((a, b) => (b.projets_count || 0) - (a.projets_count || 0));
        break;
      case 'note_desc':
        result.sort((a, b) => (b.note || 0) - (a.note || 0));
        break;
      case 'distance_asc': // 5. Nouveau cas de tri
        if (isGeoSearchActive) {
          result.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
        }
        break;
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    setFilteredEntreprises(result);
  }, [entreprises, sortOption, isGeoSearchActive]);

  // Recharger les données lorsque les filtres classiques changent
  useEffect(() => {
    if (isGeoSearchActive) return; // Ne rien faire si on est en mode GPS

    const delayDebounceFn = setTimeout(() => {
      loadEntreprises();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedSector, selectedRegion, selectedSize]);

  const handleSearch = () => {
    loadEntreprises();
  };

  const getCompanySize = (entreprise) => {
    if (entreprise.taille_entreprise) return entreprise.taille_entreprise;
    if (entreprise.effectif) {
      const effectif = entreprise.effectif;
      if (effectif <= 9) return 'TPE';
      if (effectif <= 249) return 'PME';
      if (effectif <= 4999) return 'ETI';
      return 'Grande entreprise';
    }
    return 'Non spécifiée';
  };

  // --- RENDER ---
  return (
    <div className="px-6 py-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500">
      <h1 className="text-3xl font-bold text-white mb-1">Entreprises BTP</h1>
      <p className="text-white mb-6">
        Découvrez les entreprises partenaires actives dans les projets du bâtiment
      </p>

      {/* --- 6. MODULE GÉO INTÉGRÉ --- */}
      <div className="mb-6">
        <RechercheGeoConnectee 
          onResultsFound={handleGeoResults} 
          userType="entreprise" // Important : on cherche des entreprises ici !
        />
      </div>

      {/* --- 7. BANNIÈRE INFO GÉO --- */}
      {isGeoSearchActive && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow flex justify-between items-center">
          <div>
            <p className="font-bold">📍 Recherche géographique active</p>
            <p className="text-sm">Entreprises triées par proximité.</p>
          </div>
          <button 
            onClick={handleResetSearch}
            className="text-sm underline text-green-800 hover:text-green-900 font-semibold"
          >
            Revenir aux filtres classiques
          </button>
        </div>
      )}

      {/* Section Filtres Classiques (Grisée si Géo active) */}
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 mb-8 transition-opacity ${isGeoSearchActive ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres de Recherche</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Secteurs */}
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <option value="">Tous les secteurs</option>
                <option>Gros œuvre</option>
                <option>Second œuvre</option>
                <option>Finitions</option>
                <option>Génie civil</option>
                <option>Rénovation</option>
                <option>Travaux publics</option>
                <option>Aménagement</option>
              </select>
              <RiArrowDownSLine className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* Localisations */}
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">Toutes les localisations</option>
                <option>Île-de-France</option>
                <option>Auvergne-Rhône-Alpes</option>
                <option>Nouvelle-Aquitaine</option>
                <option>Occitanie</option>
                <option>Grand-Est</option>
                <option>Provence-Alpes-Côte d'Azur</option>
              </select>
              <RiArrowDownSLine className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* Taille */}
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Toutes les tailles</option>
                <option>TPE</option>
                <option>PME</option>
                <option>ETI</option>
                <option>Grande entreprise</option>
              </select>
              <RiArrowDownSLine className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* Recherche */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher par nom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
          </div>

          <div className="flex justify-end">
            <button 
              className="bg-primary text-white px-6 py-2 rounded-button text-sm hover:bg-blue-600 transition-colors whitespace-nowrap flex items-center gap-2"
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
        <p className="text-sm text-white font-medium">{entreprises.length} entreprises trouvées</p>
        <div className="flex items-center gap-4">
          <label className="text-sm text-white">Trier par :</label>
          <select 
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="pertinence">Pertinence</option>
            <option value="localisation">Localisation</option>
            <option value="projets_desc">Nombre de projets</option>
            <option value="note_desc">Note décroissante</option>
            {isGeoSearchActive && <option value="distance_asc">Distance (plus proche)</option>}
          </select>
          <RiGridFill 
            className={`text-white hover:text-orange-300 cursor-pointer ${viewMode === 'grid' ? 'text-orange-400' : ''}`}
            onClick={() => setViewMode('grid')}
            size={24}
          />
          <RiListUnordered 
            className={`text-white hover:text-orange-300 cursor-pointer ${viewMode === 'list' ? 'text-orange-400' : ''}`}
            onClick={() => setViewMode('list')}
            size={24}
          />
        </div>
      </div>

      {/* Loading and Error Handling */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-2 text-white">Chargement des entreprises...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadEntreprises}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Cartes entreprises */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntreprises.length === 0 && !loading && (
            <div className="col-span-full text-center py-8">
              <p className="text-white opacity-80">Aucune entreprise trouvée</p>
            </div>
          )}
          {filteredEntreprises.map((entreprise, index) => (
            <div
              key={entreprise.id || index}
              className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              {/* 8. Badge de distance */}
              {isGeoSearchActive && entreprise.distance && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow flex items-center gap-1 z-10">
                  <RiMapPinRangeLine /> {entreprise.distance} km
                </div>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-2 border-primary">
                    <RiBuilding2Line className="w-8 h-8 text-white" />
                  </div>
                  {entreprise.active ? (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  ) : (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{entreprise.raison_sociale || entreprise.nom}</h3>
                  <p className="text-sm text-gray-600">{entreprise.secteur || 'Secteur non spécifié'}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                    <RiStarFill />
                    <span>{entreprise.note || 0}</span>
                    <span className="text-gray-400 ml-2">• {entreprise.projets_count || 0} projets</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Taille</span>
                  <span className="text-sm font-bold text-primary">{getCompanySize(entreprise)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Statut</span>
                  {entreprise.active ? (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {entreprise.ville && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    {entreprise.ville}
                  </span>
                )}
                {entreprise.secteur && (
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    {entreprise.secteur}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-300 flex items-center">
                  <span>Voir profil</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </button>
                <div className="text-xs text-gray-500">
                  {entreprise.code_postal && `${entreprise.code_postal}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredEntreprises.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune entreprise trouvée</p>
            </div>
          )}
          {filteredEntreprises.map((entreprise, index) => (
            <div
              key={entreprise.id || index}
              className={`flex items-center justify-between p-4 ${index < filteredEntreprises.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-2 border-primary">
                    <RiBuilding2Line className="w-6 h-6 text-white" />
                  </div>
                  {entreprise.active ? (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  ) : (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{entreprise.raison_sociale || entreprise.nom}</h3>
                  <p className="text-sm text-gray-600">{entreprise.secteur || 'Secteur non spécifié'}</p>
                  
                  {/* Affichage distance en mode liste */}
                  {isGeoSearchActive && entreprise.distance && (
                    <div className="flex items-center gap-1 text-green-600 text-xs mt-1 font-bold">
                        <RiMapPinRangeLine /> {entreprise.distance} km
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                    <RiStarFill />
                    <span>{entreprise.note || 0}</span>
                    <span className="text-gray-400 ml-1">• {entreprise.projets_count || 0} projets</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{getCompanySize(entreprise)}</p>
                  <p className="text-xs text-gray-500">{entreprise.ville || 'Localisation non spécifiée'}</p>
                </div>
                <button className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionEntreprises;