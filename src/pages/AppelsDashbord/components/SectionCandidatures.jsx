import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { toast } from 'react-toastify';
import {
  RiUser3Line,
  RiFileTextLine,
  RiMailSendLine,
  RiEyeLine,
  RiSearchLine,
  RiCheckLine,
  RiCloseLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
} from "react-icons/ri";
import callsForTendersApi from '../../../services/callsForTendersApi';
import { useAuth } from '../../../context/AuthContext';

const getStatutStyle = (statut) => {
  switch (statut) {
    case "Nouveau":
      return "bg-blue-100 text-blue-700";
    case "En évaluation":
      return "bg-yellow-100 text-yellow-700";
    case "Accepté":
      return "bg-green-100 text-green-700";
    case "Refusé":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const SectionCandidatures = forwardRef(({ setActiveSectionWithDest }, ref) => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous les statuts");
  const [sortOrder, setSortOrder] = useState("Trier par date");
  
  // State pour les candidatures et appels d'offres
  const [allApplications, setAllApplications] = useState([]);
  const [userCallsForTenders, setUserCallsForTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserApplications();
  }, [user]);

  const loadUserApplications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [SectionCandidatures] Début chargement candidatures pour utilisateur:', user.id);

      // 1. Charger tous les appels d'offres publiés par l'utilisateur
      const aoResponse = await callsForTendersApi.listCallsForTenders({ 
        publisher_only: true // Filtre pour ne récupérer que les AO de l'utilisateur
      });
      
      console.log('🔍 [SectionCandidatures] Réponse AO:', aoResponse);
      
      const userAOs = aoResponse?.calls_for_tenders || [];
      setUserCallsForTenders(userAOs);

      console.log(`🔍 [SectionCandidatures] ${userAOs.length} AO trouvés pour l'utilisateur`);

      if (userAOs.length === 0) {
        setAllApplications([]);
        return;
      }

      // 2. Pour chaque AO, charger les candidatures
      const applicationsPromises = userAOs.map(async (ao) => {
        try {
          console.log(`🔍 [SectionCandidatures] Chargement candidatures pour AO ${ao.id}: "${ao.titre}"`);
          
          const appsResponse = await callsForTendersApi.listApplications(ao.id);
          console.log(`🔍 [SectionCandidatures] Réponse candidatures AO ${ao.id}:`, appsResponse);
          
          // L'API retourne directement le tableau de candidatures
          const apps = Array.isArray(appsResponse) ? appsResponse : [];
          
          console.log(`🔍 [SectionCandidatures] ${apps.length} candidatures pour AO ${ao.id}`);
          
          // Ajouter le contexte de l'AO à chaque candidature
          return apps.map(app => ({
            ...app,
            appel_offre: ao,
            candidat: app.candidat,
            nom_ao: ao.titre,
            date_ao: ao.created_at,
            // Mapper les champs pour compatibilité avec l'UI existante

            nom: app.candidat?.raison_sociale || app.candidat?.nom_complet || `${app.candidat?.prenom || ''} ${app.candidat?.nom || ''}`.trim() || 'Candidat',
            email: app.candidat?.email || '',
            adresse_complete: app.candidat?.adresse
              ? `${app.candidat.adresse}${app.candidat.ville ? ', ' + app.candidat.ville : ''}${app.candidat.code_postal ? ' ' + app.candidat.code_postal : ''}`
              : 'Adresse non fournie',

            date: app.created_at ? new Date(app.created_at).toLocaleDateString('fr-FR') : '',
            freelance: app.candidat?.nom_complet || app.candidat?.raison_sociale || 'Candidat',
            idEntreprise: app.candidat?.id || '',
            statut: mapStatut(app.statut)
          }));
        } catch (err) {
          console.error(`❌ [SectionCandidatures] Erreur chargement candidatures AO ${ao.id}:`, err);
          return [];
        }
      });

      const allAppsArrays = await Promise.all(applicationsPromises);
      const flatApplications = allAppsArrays.flat();
      
      console.log(`🔍 [SectionCandidatures] Total candidatures trouvées: ${flatApplications.length}`);
      setAllApplications(flatApplications);

    } catch (err) {
      console.error('❌ [SectionCandidatures] Erreur chargement candidatures:', err);
      setError('Impossible de charger les candidatures');
    } finally {
      setLoading(false);
    }
  };

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    loadUserApplications
  }));

  // Fonction pour mapper les statuts de l'API vers l'UI
  const mapStatut = (statutApi) => {
    if (!statutApi) return 'En évaluation';
    const normalized = statutApi.trim().toLowerCase();

    if (normalized.includes('attente')) return 'Nouveau';
    if (normalized.includes('accept')) return 'Accepté';
    if (normalized.includes('refus')) return 'Refusé';
  
    return 'En évaluation';
  };

  // Fonction pour accepter une candidature
  const handleAccept = async (application) => {
  try {
    const res = await callsForTendersApi.acceptApplication(
      application.appel_offre.id,
      application.id
    );
    console.log("✅ Réponse API acceptApplication:", res);
    toast.success('Candidature acceptée');

    // ✅ Met à jour immédiatement dans le state local
    setAllApplications(prev =>
      prev.map(app =>
        app.id === application.id
          ? { ...app, statut: 'Accepté' }
          : app
      )
    );

    // 🕒 Attend 1 seconde avant de recharger pour laisser le backend se synchroniser
    setTimeout(() => {
      loadUserApplications();
    }, 1000);

    } catch (err) {
      console.error('Erreur acceptation:', err);
      toast.error("Erreur lors de l'acceptation");
    }
  };

  // Fonction pour refuser une candidature
  const handleReject = async (application) => {
    try {
      await callsForTendersApi.rejectApplication(application.appel_offre.id, application.id);
      toast.success('Candidature refusée');
      loadUserApplications(); // Recharger les données
    } catch (err) {
      console.error('Erreur refus:', err);
      toast.error('Erreur lors du refus');
    }
  };

  const filtered = allApplications
    .filter((cand) => {
      const lower = search.toLowerCase();
      return (
        cand.nom.toLowerCase().includes(lower) ||
        cand.freelance.toLowerCase().includes(lower) ||
        cand.nom_ao.toLowerCase().includes(lower)
      );
    })
    .filter((cand) => {
      if (statutFilter === "Tous les statuts") return true;
      return cand.statut === statutFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "Plus récent") return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
      if (sortOrder === "Plus ancien") return new Date(a.created_at || a.date) - new Date(b.created_at || b.date);
      return 0;
    });

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadUserApplications}
            className="mt-2 text-red-600 hover:underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500">
      <h1 className="text-3xl font-bold text-white mb-2">Candidatures reçues</h1>
      <p className="text-white mb-6">
        Suivez les réponses des freelances ou entreprises à vos appels d'offres publiés.
      </p>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiSearchLine className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une candidature..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <select
                value={statutFilter}
                onChange={(e) => setStatutFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-8"
              >
                <option>Tous les statuts</option>
                <option>Nouveau</option>
                <option>En évaluation</option>
                <option>Accepté</option>
                <option>Refusé</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-8"
              >
                <option>Trier par date</option>
                <option>Plus récent</option>
                <option>Plus ancien</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <RiFileTextLine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
          <p className="text-gray-600">
            {allApplications.length === 0 
              ? "Vous n'avez reçu aucune candidature pour vos appels d'offres."
              : "Aucune candidature ne correspond aux filtres sélectionnés."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((cand) => (
            <div
              key={`${cand.id}-${cand.appel_offre.id}`}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-800">{cand.nom}</h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getStatutStyle(cand.statut)}`}
                    >
                      {cand.statut}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Pour: {cand.nom_ao}
                  </p>
                  <span className="text-sm text-gray-500">{cand.date}</span>
                </div>
              </div>

              <div className="text-sm text-gray-700 mb-3 space-y-2">
                <div className="flex items-center gap-2">
                  <RiUser3Line className="text-primary flex-shrink-0" />
                  <span>{cand.freelance}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <RiFileTextLine className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{cand.proposition}</span>
                </div>

                {(cand.budget_propose || cand.duree_proposee) && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    {cand.budget_propose && (
                      <div className="flex items-center gap-1">
                        <RiMoneyDollarCircleLine className="text-green-600" />
                        <span>{cand.budget_propose} €</span>
                      </div>
                    )}
                    {cand.duree_proposee && (
                      <div className="flex items-center gap-1">
                        <RiCalendarLine className="text-blue-600" />
                        <span>{cand.duree_proposee}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                {cand.statut === 'Nouveau' && (
                  <>
                    <button
                      onClick={() => handleAccept(cand)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-green-200 transition"
                    >
                      <RiCheckLine />
                      Accepter
                    </button>
                    <button
                      onClick={() => handleReject(cand)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-red-200 transition"
                    >
                      <RiCloseLine />
                      Refuser
                    </button>
                  </>
                )}
                
                <button
                  onClick={() =>
                    setActiveSectionWithDest("detailsCandidature", cand)
                  }
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-blue-200 transition"
                >
                  <RiEyeLine />
                  Détails
                </button>
                
                <button
                  onClick={() => {
                    console.log('Ouverture messagerie pour candidature:', cand);
                    // Créer les données de message avec le contexte de la candidature
                    const messageData = {
                      appel_offre_id: cand.appel_offre.id,
                      candidature_id: cand.id,
                      candidat_nom: cand.freelance || cand.nom,
                      appel_offre_titre: cand.nom_ao,
                      destinataire_id: cand.candidat?.id,
                      destinataire_type: cand.candidat_type || 'freelance'
                    };
                    setActiveSectionWithDest("messages", messageData);
                  }}
                  className="bg-secondary text-white px-4 py-2 rounded-button text-sm hover:bg-green-600 transition-colors whitespace-nowrap"
                >
                  <RiMailSendLine />
                  Message
                </button>

                {cand.statut === 'Accepté' && (
                  <button
                    onClick={() => setActiveSectionWithDest("factureAppelOffre", cand)}
                    className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-yellow-200 transition"
                  >
                    <RiMoneyDollarCircleLine />
                       Paiement
                  </button>
                  )}


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default SectionCandidatures;
