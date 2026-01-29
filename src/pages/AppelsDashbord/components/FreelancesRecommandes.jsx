import React, { useState, useEffect } from "react";
import { RiStarFill, RiLoader4Line } from "react-icons/ri";
import freelancesApi from "../../../services/freelancesApi";

const FreelancesRecommandes = () => {
  const [freelances, setFreelances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendedFreelances();
  }, []);

  const fetchRecommendedFreelances = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await freelancesApi.getRecommendedFreelances();
      setFreelances(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des freelances recommandés:', err);
      setError('Impossible de charger les freelances recommandés');
    } finally {
      setLoading(false);
    }
  };

  const formatFreelanceData = (freelance) => {
    return {
      id: freelance.id,
      nom: `${freelance.prenom} ${freelance.nom}`,
      role: freelance.specialite || freelance.role,
      image: freelance.photo_profil || freelance.image || `https://readdy.ai/api/search-image?query=professional%20portrait%20construction%20worker&width=60&height=60&seq=freelance${freelance.id}&orientation=squarish`,
      note: freelance.note_moyenne || freelance.note || 0,
      projets: freelance.nb_projets || freelance.projets || 0,
      isActive: freelance.is_active !== undefined ? freelance.is_active : true
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Freelances Recommandés</h3>
            <button className="text-sm text-primary hover:text-blue-600">Voir tout</button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <RiLoader4Line className="animate-spin text-2xl text-primary" />
            <span className="ml-2 text-gray-500">Chargement des freelances...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Freelances Recommandés</h3>
            <button className="text-sm text-primary hover:text-blue-600">Voir tout</button>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchRecommendedFreelances}
              className="bg-primary text-white px-4 py-2 rounded-button text-sm hover:bg-blue-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!freelances.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Freelances Recommandés</h3>
            <button className="text-sm text-primary hover:text-blue-600">Voir tout</button>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun freelance recommandé disponible pour le moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Freelances Recommandés</h3>
          <button className="text-sm text-primary hover:text-blue-600">Voir tout</button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {freelances.map((freelance) => {
            const formattedData = formatFreelanceData(freelance);
            return (
              <div
                key={formattedData.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={formattedData.image}
                    alt={formattedData.nom}
                    className="w-12 h-12 rounded-full object-cover object-top"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedData.nom)}&background=0066cc&color=fff&size=48`;
                    }}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{formattedData.nom}</h4>
                      {!formattedData.isActive && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                          Inactif
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{formattedData.role}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 flex items-center justify-center text-yellow-400">
                          <RiStarFill className="text-xs" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {formattedData.note ? formattedData.note.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 ml-2">
                        • {formattedData.projets} projet{formattedData.projets > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-button text-sm hover:bg-blue-600 transition-colors whitespace-nowrap">
                  Contacter
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FreelancesRecommandes;
