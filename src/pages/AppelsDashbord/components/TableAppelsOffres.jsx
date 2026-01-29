import React, { useState, useEffect } from "react";
import {
  RiArrowUpDownLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import callsForTendersApi from "../../../services/callsForTendersApi";

const TableAppelsOffres = ({ showPublisherOnly = false }) => {
  const [appelsOffres, setAppelsOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchAppelsOffres = async (page = 1) => {
    try {
      setLoading(true);
      console.log('📋 TableAppelsOffres - Chargement des AO, page:', page);
      
      const filters = {
        page,
        limit: pagination.limit,
        publisher_only: showPublisherOnly
      };
      
      const data = await callsForTendersApi.listCallsForTenders(filters);
      console.log('📋 TableAppelsOffres - Données reçues:', data);
      
      if (data && data.calls_for_tenders) {
        setAppelsOffres(data.calls_for_tenders);
        setPagination({
          page: data.pagination?.page || 1,
          limit: data.pagination?.limit || 10,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0
        });
        setError(null);
      }
    } catch (err) {
      console.error('❌ TableAppelsOffres - Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppelsOffres(1);
  }, [showPublisherOnly]);

  const formatDate = (dateString) => {
    if (!dateString) return "Non défini";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatBudget = (budget, type_tarif = 'forfait') => {
    if (!budget) return "Non défini";
    const formattedBudget = Number(budget).toLocaleString('fr-FR');
    const suffix = type_tarif === 'horaire' ? ' €/h' : ' €';
    return formattedBudget + suffix;
  };

  const getStatutInfo = (statut, date_limite) => {
    if (!statut || statut === 'published') {
      // Vérifier si la date limite est dépassée
      if (date_limite && new Date(date_limite) < new Date()) {
        return {
          label: "Expiré",
          color: "bg-red-100 text-red-800"
        };
      }
      return {
        label: "Actif",
        color: "bg-green-100 text-green-800"
      };
    }
    
    switch (statut) {
      case 'draft':
        return {
          label: "Brouillon",
          color: "bg-gray-100 text-gray-800"
        };
      case 'closed':
        return {
          label: "Fermé",
          color: "bg-red-100 text-red-800"
        };
      case 'completed':
        return {
          label: "Terminé",
          color: "bg-blue-100 text-blue-800"
        };
      default:
        return {
          label: "Actif",
          color: "bg-green-100 text-green-800"
        };
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchAppelsOffres(newPage);
    }
  };

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <div className="animate-pulse">
          <div className="bg-gray-50 h-12 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white h-16 mb-2 border-b"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Erreur lors du chargement</div>
        <div className="text-sm text-gray-500">{error}</div>
        <button 
          onClick={() => fetchAppelsOffres(pagination.page)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (appelsOffres.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {showPublisherOnly 
          ? "Vous n'avez publié aucun appel d'offre"
          : "Aucun appel d'offre disponible"
        }
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {["Titre", "Date", "Budget"].map((head, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-1">
                  <span>{head}</span>
                  <div className="w-3 h-3 flex items-center justify-center">
                    <RiArrowUpDownLine />
                  </div>
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Propositions
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appelsOffres.map((appel, index) => {
            const statutInfo = getStatutInfo(appel.statut, appel.date_limite);
            return (
              <tr
                key={appel.id || index}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={(e) => {
                  if (!e.target.closest("button")) {
                    e.currentTarget.classList.toggle("bg-blue-50");
                  }
                }}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {appel.titre}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-md">
                      {appel.description || 'Aucune description'}
                    </div>
                    {appel.company_name && (
                      <div className="text-xs text-gray-400 mt-1">
                        {appel.company_name}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatDate(appel.created_at)}
                  {appel.date_limite && (
                    <div className="text-xs text-gray-500">
                      Limite: {formatDate(appel.date_limite)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatBudget(appel.budget, appel.type_tarif)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statutInfo.color}`}
                  >
                    {statutInfo.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {appel.candidatures_count || 0}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                      title="Voir les détails"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Voir AO:', appel.id);
                      }}
                    >
                      <RiEyeLine className="w-4 h-4" />
                    </button>
                    {showPublisherOnly && (
                      <>
                        <button 
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                          title="Modifier"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Modifier AO:', appel.id);
                          }}
                        >
                          <RiEditLine className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Supprimer AO:', appel.id);
                          }}
                        >
                          <RiDeleteBinLine className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Affichage de {((pagination.page - 1) * pagination.limit) + 1} à {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} résultats
            </div>
            <div className="flex items-center space-x-2">
              {pagination.page > 1 && (
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-3 py-2 text-sm rounded-button text-gray-500 hover:text-primary border border-gray-200"
                >
                  Précédent
                </button>
              )}
              
              {[...Array(Math.min(5, pagination.pages))].map((_, index) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = index + 1;
                } else if (pagination.page <= 3) {
                  pageNum = index + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + index;
                } else {
                  pageNum = pagination.page - 2 + index;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm rounded-button ${
                      pageNum === pagination.page
                        ? "bg-primary text-white"
                        : "text-gray-500 hover:text-primary border border-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {pagination.page < pagination.pages && (
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-3 py-2 text-sm rounded-button text-gray-500 hover:text-primary border border-gray-200"
                >
                  Suivant
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableAppelsOffres;
