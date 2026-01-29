import React, { useState, useEffect } from "react";
import { RiSearchLine, RiStarFill, RiStarLine, RiGridFill, RiListUnordered, RiArrowDownSLine, RiMapPinRangeLine } from "react-icons/ri";
import authApi from "../../../services/authApi";
import FreelanceProfileModal from "../../../components/FreelanceProfileModal";
import RechercheGeoConnectee from "../../../components/RechercheGeoConnectee";

const SectionFreelances = () => {
  const [selectedFreelance, setSelectedFreelance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarif, setTarif] = useState(600);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availability, setAvailability] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [freelances, setFreelances] = useState([]);
  const [filteredFreelances, setFilteredFreelances] = useState([]);
  const [sortOption, setSortOption] = useState("pertinence");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeoSearchActive, setIsGeoSearchActive] = useState(false);

  const normalize = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  useEffect(() => { loadFreelances(); }, []);

  useEffect(() => {
    let result = [...freelances];
    switch (sortOption) {
      case 'tarif_asc': result.sort((a, b) => (a.daily_rate || a.tarif || 0) - (b.daily_rate || b.tarif || 0)); break;
      case 'note_desc': result.sort((a, b) => (b.note || 0) - (a.note || 0)); break;
      case 'experience_desc': result.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0)); break;
      case 'distance_asc': if (isGeoSearchActive) result.sort((a, b) => (a.distance || 9999) - (b.distance || 9999)); break;
      default: result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    setFilteredFreelances(result);
  }, [freelances, sortOption, isGeoSearchActive]);

  useEffect(() => {
    if (isGeoSearchActive) return;
    const delayDebounceFn = setTimeout(() => { loadFreelances(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedSpecialty, selectedRegion, tarif, availability]);

  const loadFreelances = async () => {
    try {
      setLoading(true); setError(null); setIsGeoSearchActive(false);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedSpecialty) filters.specialty = normalize(selectedSpecialty);
      if (selectedRegion) filters.region = selectedRegion;
      if (tarif !== undefined && tarif !== null) filters.maxRate = tarif;
      if (availability === "available") filters.availableOnly = 1;
      const data = await authApi.getFreelancers(filters);
      setFreelances(data);
    } catch (err) { setError('Erreur lors du chargement des freelances'); console.error(err); } finally { setLoading(false); }
  };

  const handleGeoResults = (results) => { setFreelances(results); setIsGeoSearchActive(true); setSortOption('distance_asc'); };
  const handleResetSearch = () => { setSearchTerm(""); setSelectedSpecialty(""); setSelectedRegion(""); loadFreelances(); };

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-1">Auto-entrepreneurs BTP</h1>
      <p className="text-white mb-6">Trouvez les meilleurs professionnels independants pour vos projets de construction</p>

      <div className="mb-6"><RechercheGeoConnectee onResultsFound={handleGeoResults} userType="freelance" /></div>

      {isGeoSearchActive && (<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow flex justify-between items-center"><div><p className="font-bold">\ud83d\udccd Recherche geographique active</p><p className="text-sm">Resultats tries par proximite.</p></div><button onClick={handleResetSearch} className="text-sm underline text-green-800 hover:text-green-900 font-semibold">Revenir aux filtres classiques</button></div>)}

      <div className={`bg-gradient-to-r from-blue-500 via-blue-600 rounded-xl shadow-sm border border-gray-100 mb-8 transition-opacity ${isGeoSearchActive ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-white mb-4">Filtres de Recherche Classiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative"><select className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full" value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}><option value="">Toutes les specialites</option><option>Plombier</option><option>Electricien</option><option>Macon</option><option>Carreleur</option><option>Peintre</option><option>Menuisier</option><option>Couvreur</option><option>Chauffagiste</option></select><RiArrowDownSLine className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
            <div className="relative"><select className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}><option value="">Toutes les regions</option><option>Ile-de-France</option><option>Auvergne-Rhone-Alpes</option><option>Nouvelle-Aquitaine</option><option>Occitanie</option><option>Grand-Est</option><option>Provence-Alpes-Cote d'Azur</option></select><RiArrowDownSLine className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
            <div className="space-y-2"><label className="text-sm text-white">Tarif journalier max (\u20ac)</label><div className="px-2"><input type="range" min={0} max={1000} value={tarif} onChange={(e) => setTarif(e.target.value)} className="w-full" /><div className="flex justify-between text-xs text-white mt-1"><span>0\u20ac</span><span>{tarif}\u20ac</span><span>1000\u20ac+</span></div></div></div>
            <div className="relative"><input type="text" placeholder="Nom ou ville..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" /><RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white">{filteredFreelances.length} freelances trouves</p>
        <div className="flex items-center gap-4">
          <label className="text-sm text-white">Trier par :</label>
          <select className="border border-gray-300 rounded-md px-2 py-1 text-sm text-black" value={sortOption} onChange={(e) => setSortOption(e.target.value)}><option value="pertinence">Pertinence</option><option value="tarif_asc">Tarif croissant</option><option value="note_desc">Note decroissante</option>{isGeoSearchActive && <option value="distance_asc">Distance (plus proche)</option>}</select>
          <RiGridFill className={`cursor-pointer ${viewMode === 'grid' ? 'text-orange-400' : 'text-white'}`} onClick={() => setViewMode('grid')} size={24} />
          <RiListUnordered className={`cursor-pointer ${viewMode === 'list' ? 'text-orange-400' : 'text-white'}`} onClick={() => setViewMode('list')} size={24} />
        </div>
      </div>

      {loading && (<div className="flex justify-center items-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div><span className="ml-2 text-white">Chargement...</span></div>)}
      {error && (<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-6"><p className="text-red-600">{error}</p><button onClick={loadFreelances} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Reessayer</button></div>)}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelances.length === 0 && !loading && (<div className="col-span-full text-center py-8"><p className="text-white">Aucun freelance trouve</p></div>)}
          {filteredFreelances.map((freelance, index) => (
            <div key={freelance.id || index} className="border border-blue-300 rounded-xl p-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-white relative">
              {isGeoSearchActive && freelance.distance && (<div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow flex items-center gap-1"><RiMapPinRangeLine /> {freelance.distance} km</div>)}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative"><img src={freelance.avatar_url || freelance.img || "/api/placeholder/40/40"} alt={freelance.nom} className="w-16 h-16 rounded-full object-cover filter hue-rotate-0 saturate-200 border-2 border-orange-500" onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }} /><div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${freelance.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div></div>
                <div><h3 className="text-xl font-bold text-white">{freelance.nom} {freelance.prenom}</h3><p className="text-sm text-white opacity-90">{freelance.secteur || freelance.specialite || 'Professionnel BTP'}</p><div className="flex items-center gap-1 text-yellow-400 text-sm mt-1"><RiStarFill /><span>{freelance.note || 4.5}</span><span className="text-white ml-2 opacity-80">\u2022 {freelance.experience || 0} exp.</span></div></div>
              </div>
              <div className="mb-4 bg-white/10 p-3 rounded-lg"><div className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-white opacity-80">Tarif journalier</span><span className="text-lg font-bold text-white">{freelance.daily_rate || freelance.tarif || 'N/A'}\u20ac</span></div><div className="flex justify-between items-center"><span className="text-sm font-medium text-white opacity-80">Ville</span><span className="text-sm font-medium text-white">{freelance.ville}</span></div></div>
              <button className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:from-orange-500 hover:to-orange-700 transition-all shadow-sm flex justify-center items-center gap-2" onClick={() => { setSelectedFreelance(freelance); setIsModalOpen(true); }}>Voir le profil</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-md border border-blue-300 overflow-hidden text-white flex flex-col">
          {filteredFreelances.length === 0 && !loading && (<div className="text-center py-8"><p className="text-gray-200">Aucun freelance trouve</p></div>)}
          {filteredFreelances.map((freelance, index) => (
            <div key={freelance.id || index} className={`flex items-center justify-between p-4 ${index < filteredFreelances.length - 1 ? 'border-b border-blue-400' : ''} hover:bg-white/5 transition-colors`}>
              <div className="flex items-center space-x-4"><img src={freelance.avatar_url || "/api/placeholder/40/40"} alt={freelance.nom} className="w-12 h-12 rounded-full object-cover border-2 border-orange-400" onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }} /><div><h3 className="font-bold text-white">{freelance.nom} {freelance.prenom}</h3><p className="text-sm text-blue-100">{freelance.secteur}</p>{isGeoSearchActive && freelance.distance && (<span className="text-xs text-green-300 flex items-center gap-1 mt-1"><RiMapPinRangeLine /> A {freelance.distance} km</span>)}</div></div>
              <div className="flex items-center space-x-6"><div className="text-right"><p className="font-bold text-white">{freelance.daily_rate || freelance.tarif}\u20ac/j</p><p className="text-xs text-blue-200">{freelance.ville}</p></div><button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow" onClick={() => { setSelectedFreelance(freelance); setIsModalOpen(true); }}>Voir</button></div>
            </div>
          ))}
        </div>
      )}
      {selectedFreelance && (<FreelanceProfileModal freelance={selectedFreelance} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedFreelance(null); }} />)}
    </div>
  );
};

export default SectionFreelances;
