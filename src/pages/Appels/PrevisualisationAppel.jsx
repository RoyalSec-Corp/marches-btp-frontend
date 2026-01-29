import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import callsForTendersApi from '../../services/callsForTendersApi';
import { 
  RiArrowLeftLine, 
  RiCheckLine, 
  RiUploadCloud2Line,
  RiFileLine 
} from 'react-icons/ri';

function PrevisualisationAppel() {
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!data) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto py-10 px-6">
          <div className="bg-white rounded-xl border p-8 shadow-sm text-center">
            <div className="text-red-600 mb-4">
              <RiFileLine className="mx-auto h-12 w-12 mb-4" />
              <h2 className="text-xl font-bold">Aucune donnée à prévisualiser</h2>
              <p className="text-gray-600 mt-2">Veuillez remplir le formulaire de création d'appel d'offres.</p>
            </div>
            <button
              onClick={() => navigate('/appel-offre')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
            >
              Créer un appel d'offres
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fonction pour publier directement depuis la prévisualisation
  const handlePublishFromPreview = async () => {
    try {
      setLoading(true);

      // Construire le payload API (même logique que dans AppelOffreCreation.jsx)
      const skills = (data.motsCles || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const criteresData = (data.criteres || [])
        .filter(c => c.label?.trim())
        .reduce((acc, c, index) => {
          acc[`critere_${index + 1}`] = {
            label: c.label.trim(),
            weight: Number(c.pourcentage || 0)
          };
          return acc;
        }, {});

      const docsTech = (data.documentsTechniques || []).map(f => ({ 
        name: f.name, 
        size: f.size, 
        type: f.type 
      }));
      const docsJoin = (data.documentsJoindre || []).map(f => ({ 
        name: f.name, 
        size: f.size, 
        type: f.type 
      }));

      const payload = {
        titre: data.titre.trim(),
        description: data.description.trim(),
        budget: Number(data.budget),
        date_limite: data.dateLimite,
        reference: data.reference?.trim() || null,
        localisation: data.localisation?.trim() || null,
        mots_cles: skills,
        objectifs: data.objectifs?.trim() || null,
        surface: data.surface ? Number(data.surface) : null,
        type_construction: data.typeConstruction?.trim() || null,
        qualifications: data.qualifications?.trim() || null,
        requirements: data.requirements?.trim() || null,
        budgetUnit: data.budgetUnit || 'forfait',
        criteres: criteresData,
        skills: skills,
        documents_techniques: docsTech,
        documents_joindre: docsJoin
      };

      console.log('[PrevisualisationAppel] Publication payload:', payload);

      const response = await callsForTendersApi.createCallForTender(payload);
      
      console.log('[PrevisualisationAppel] Réponse API:', response);

      // Message de succès avec toast personnalisé
      toast.success(
        "🎉 Appel d'offre publié avec succès ! Il est maintenant visible par tous les freelances.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: '#10B981',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600'
          }
        }
      );
      
      // Redirection vers le dashboard des appels d'offres avec un délai pour laisser voir le toast
      setTimeout(() => {
        navigate('/dashbord-appels-offre', { replace: true });
      }, 1500);
      
    } catch (error) {
      console.error('[PrevisualisationAppel] Erreur:', error);
      
      let errorMessage = "Erreur lors de la publication de l'appel d'offre";
      
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.status === 403) {
        errorMessage = "Vous n'êtes pas autorisé à publier des appels d'offres";
      } else if (error?.response?.status === 400) {
        errorMessage = "Données invalides. Vérifiez vos informations.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/appel-offre', { state: data })}
                className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <RiArrowLeftLine className="text-xl" />
              </button>
              <div className="font-['Pacifico'] text-2xl text-primary">Marchés Btp</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Prévisualisation de l'appel d'offres</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border p-8 shadow-sm">
          
          {/* Informations principales */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Informations générales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Référence :</span>
                <span className="ml-2 text-gray-900">{data.reference || 'Auto-générée'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type de construction :</span>
                <span className="ml-2 text-gray-900">{data.typeConstruction || 'Non spécifié'}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Titre :</span>
                <p className="mt-1 text-gray-900">{data.titre}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date limite :</span>
                <span className="ml-2 text-gray-900">
                  {new Date(data.dateLimite).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Localisation :</span>
                <span className="ml-2 text-gray-900">{data.localisation || 'Non spécifiée'}</span>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Description du projet
            </h2>
            <p className="text-gray-900 whitespace-pre-wrap mb-4">{data.description}</p>
            
            {data.motsCles && (
              <div className="mb-4">
                <span className="font-medium text-gray-700">Mots-clés :</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.motsCles.split(',').map((mot, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {mot.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.objectifs && (
              <div>
                <span className="font-medium text-gray-700">Objectifs :</span>
                <p className="mt-1 text-gray-900">{data.objectifs}</p>
              </div>
            )}
          </section>

          {/* Spécifications techniques */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Spécifications techniques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Budget :</span>
                <span className="ml-2 text-gray-900 font-semibold text-lg text-green-600">
                  {Number(data.budget).toLocaleString()} € ({data.budgetUnit === 'horaire' ? 'par heure' : 'forfait'})
                </span>
              </div>
              {data.surface && (
                <div>
                  <span className="font-medium text-gray-700">Surface :</span>
                  <span className="ml-2 text-gray-900">{data.surface} m²</span>
                </div>
              )}
            </div>
            
            {data.requirements && (
              <div className="mt-4">
                <span className="font-medium text-gray-700">Exigences spécifiques :</span>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{data.requirements}</p>
              </div>
            )}
          </section>

          {/* Critères et qualifications */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Critères de sélection
            </h2>
            
            {data.criteres && data.criteres.length > 0 && data.criteres.some(c => c.label?.trim()) ? (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Critères d'évaluation :</h3>
                <ul className="space-y-2">
                  {data.criteres.filter(c => c.label?.trim()).map((critere, i) => (
                    <li key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{critere.label}</span>
                      <span className="text-primary font-semibold">{critere.pourcentage}%</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-sm text-gray-600">
                  Total : {data.criteres.reduce((sum, c) => sum + Number(c.pourcentage || 0), 0)}%
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">Aucun critère spécifique défini</p>
            )}

            {data.qualifications && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Qualifications requises :</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{data.qualifications}</p>
              </div>
            )}
          </section>

          {/* Documents */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Documents
            </h2>
            
            {data.documentsTechniques && data.documentsTechniques.length > 0 ? (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Documents techniques :</h3>
                <ul className="space-y-2">
                  {data.documentsTechniques.map((file, i) => (
                    <li key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <RiFileLine className="text-primary mr-3" />
                      <div>
                        <span className="text-gray-900 font-medium">{file.name}</span>
                        <span className="ml-2 text-gray-500 text-sm">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">Aucun document technique ajouté</p>
            )}

            {data.documentsJoindre && data.documentsJoindre.length > 0 ? (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Documents complémentaires :</h3>
                <ul className="space-y-2">
                  {data.documentsJoindre.map((file, i) => (
                    <li key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <RiFileLine className="text-primary mr-3" />
                      <div>
                        <span className="text-gray-900 font-medium">{file.name}</span>
                        <span className="ml-2 text-gray-500 text-sm">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Aucun document complémentaire ajouté</p>
            )}
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/appel-offre', { state: data })}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center space-x-2"
              disabled={loading}
            >
              <RiArrowLeftLine />
              <span>Modifier</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashbord-appels-offre')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Annuler
              </button>
              
              <button
                onClick={handlePublishFromPreview}
                disabled={loading}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publication en cours...</span>
                  </>
                ) : (
                  <>
                    <RiCheckLine />
                    <span>Publier l'Appel d'Offre</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PrevisualisationAppel;
