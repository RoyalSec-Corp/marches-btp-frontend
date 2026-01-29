// src/pages/AppelsOffres/AppelOffreCreation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import callsForTendersApi from '../../services/callsForTendersApi';
import {
  RiArrowLeftLine, RiInformationLine, RiFileTextLine, RiToolsLine, RiCheckboxLine,
  RiAttachmentLine, RiUploadCloud2Line, RiCloseLine
} from 'react-icons/ri';

function AppelOffreCreation() {
  const navigate = useNavigate();
  const location = useLocation();

  // States - alignés avec les champs backend
  const [reference, setReference] = useState('');
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetUnit, setBudgetUnit] = useState('forfait');
  const [dateLimite, setDateLimite] = useState('');
  const [motsCles, setMotsCles] = useState('');
  const [objectifs, setObjectifs] = useState('');
  const [surface, setSurface] = useState('');
  const [typeConstruction, setTypeConstruction] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [requirements, setRequirements] = useState('');
  const [criteres, setCriteres] = useState([{ label: '', pourcentage: '' }]);
  const [documentsTechniques, setDocumentsTechniques] = useState([]);
  const [documentsJoindre, setDocumentsJoindre] = useState([]);
  const [loading, setLoading] = useState(false);

  // Restaurer les données depuis la prévisualisation
  useEffect(() => {
    if (location.state && location.state.titre) {
      console.log('[AppelOffreCreation] Restauration des données depuis prévisualisation:', location.state);
      const data = location.state;
      
      setReference(data.reference || '');
      setTitre(data.titre || '');
      setDescription(data.description || '');
      setLocalisation(data.localisation || '');
      setBudget(data.budget || '');
      setBudgetUnit(data.budgetUnit || 'forfait');
      setDateLimite(data.dateLimite || '');
      setMotsCles(data.motsCles || '');
      setObjectifs(data.objectifs || '');
      setSurface(data.surface || '');
      setTypeConstruction(data.typeConstruction || '');
      setQualifications(data.qualifications || '');
      setRequirements(data.requirements || '');
      setCriteres(data.criteres && data.criteres.length > 0 ? data.criteres : [{ label: '', pourcentage: '' }]);
      setDocumentsTechniques(data.documentsTechniques || []);
      setDocumentsJoindre(data.documentsJoindre || []);

      // Afficher un toast pour confirmer la restauration des données
      toast.info("📋 Données restaurées depuis la prévisualisation", {
        position: "top-right",
        autoClose: 3000
      });
    }
  }, [location.state]);

  // Helpers
  const handleFileSelect = (e, setFiles) => {
    const files = Array.from(e.target.files);
    setFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index, setFiles) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleValidateCritere = (index) => {
    const current = criteres[index];
    if (current.label.trim() && current.pourcentage !== '') {
      const isLast = index === criteres.length - 1;
      const allFilled = criteres.every(c => c.label.trim() && c.pourcentage !== '');
      if (isLast && allFilled) {
        setCriteres(prev => [...prev, { label: '', pourcentage: '' }]);
      }
    }
  };

  // Construction du payload API - parfaitement aligné avec le backend
  const buildApiPayload = () => {
    // Mots-clés -> array pour le champ skills
    const skills = (motsCles || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Critères -> objet structuré
    const criteresData = criteres
      .filter(c => c.label?.trim())
      .reduce((acc, c, index) => {
        acc[`critere_${index + 1}`] = {
          label: c.label.trim(),
          weight: Number(c.pourcentage || 0)
        };
        return acc;
      }, {});

    // Documents -> métadonnées (pas d'upload binaire)
    const docsTech = documentsTechniques.map(f => ({ 
      name: f.name, 
      size: f.size, 
      type: f.type 
    }));
    const docsJoin = documentsJoindre.map(f => ({ 
      name: f.name, 
      size: f.size, 
      type: f.type 
    }));

    // Payload exactement comme attendu par le backend
    return {
      // Champs obligatoires selon le backend
      titre: titre.trim(),
      description: description.trim(),
      budget: budget && !isNaN(budget) ? Number(budget) : null,
      date_limite: dateLimite ? new Date(dateLimite).toISOString() : null,

      // Champs optionnels mais importants
      reference: reference.trim() || null,
      localisation: localisation.trim() || null,
      mots_cles: skills,
      objectifs: objectifs.trim() || null,
      surface: surface ? Number(surface) : null,
      type_construction: typeConstruction.trim() || null,
      qualifications: qualifications.trim() || null,
      requirements: requirements.trim() || null,
      
      // Type de tarification
      budgetUnit: budgetUnit,
      
      // Données structurées
      criteres: criteresData,
      skills: skills,
      documents_techniques: docsTech,
      documents_joindre: docsJoin,

      // ✅ Ajouter le statut pour que l'AO soit immédiatement visible
      status: 'published'
    };
  };

  // Validation intelligente
  const validateForm = () => {
    const errors = [];

    // Champs obligatoires selon le backend
    if (!titre.trim()) errors.push('Le titre est obligatoire');
    if (!description.trim()) errors.push('La description est obligatoire');
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      errors.push('Le budget doit être un nombre positif');
    }
    if (!dateLimite) errors.push('La date limite est obligatoire');

    // Validation de la date limite (ne doit pas être dans le passé)
    if (dateLimite && new Date(dateLimite) <= new Date()) {
      errors.push('La date limite doit être dans le futur');
    }

    // Validation des critères si présents
    const criteresValides = criteres.filter(c => c.label?.trim());
    if (criteresValides.length > 0) {
      const totalPourcentage = criteresValides.reduce((sum, c) => sum + Number(c.pourcentage || 0), 0);
      if (totalPourcentage > 100) {
        errors.push('Le total des pourcentages des critères ne peut pas dépasser 100%');
      }
    }

    return errors;
  };

  // Submit avec gestion d'erreurs robuste
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(`Erreurs de validation :\n${errors.join('\n')}`);
      return;
    }

    try {
      setLoading(true);
      const payload = buildApiPayload();
      
      console.log('[AppelOffreCreation] Envoi payload vers API:', payload);

      const response = await callsForTendersApi.createCallForTender(payload);
      
      console.log('[AppelOffreCreation] Réponse API:', response);

      // Message de succès avec toast personnalisé et très visible
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
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px 24px'
          }
        }
      );
      
      // Redirection vers le dashboard des appels d'offres avec un délai pour laisser voir le toast
      setTimeout(() => {
        navigate('/dashbord-appels-offre', { replace: true });
      }, 1500);
      
    } catch (error) {
      console.error('[AppelOffreCreation] Erreur:', error);
      
      // Gestion fine des erreurs
      let errorMessage = "Erreur lors de la création de l'appel d'offre";
      
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
              <Link 
                to="/dashbord-appels-offre" 
                className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <RiArrowLeftLine className="text-xl" />
              </Link>
              <div className="font-['Pacifico'] text-2xl text-primary">Marchés Btp</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Création d'Appel d'Offres BTP</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border p-8 shadow-sm">
          <form className="space-y-10" onSubmit={handleSubmit}>
            
            {/* Informations Générales */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <RiInformationLine className="text-primary mr-3" /> Informations Générales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence du projet
                    <span className="text-xs text-gray-500 ml-2">(Auto-générée si vide)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex : BTP-2025-001"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de construction
                    <span className="text-xs text-gray-500 ml-2">(Recommandé)</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={typeConstruction}
                    onChange={(e) => setTypeConstruction(e.target.value)}
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="maison">Maison individuelle</option>
                    <option value="appartement">Appartement</option>
                    <option value="commercial">Bâtiment commercial</option>
                    <option value="industriel">Bâtiment industriel</option>
                    <option value="renovation">Rénovation</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'appel d'offres *
                    <span className="text-red-500 text-xs ml-1">(Obligatoire)</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Construction d'un immeuble de bureaux de 5 étages"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date limite de candidature *
                    <span className="text-red-500 text-xs ml-1">(Obligatoire)</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={dateLimite}
                    onChange={(e) => setDateLimite(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation du projet
                    <span className="text-xs text-gray-500 ml-2">(Recommandé)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Paris 15e, Lyon Centre, etc."
                    value={localisation}
                    onChange={(e) => setLocalisation(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Description du Projet */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <RiFileTextLine className="text-primary mr-3" /> Description du Projet
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée du projet *
                  <span className="text-red-500 text-xs ml-1">(Obligatoire)</span>
                </label>
                <textarea
                  rows="6"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Décrivez en détail le projet, les travaux à effectuer, les contraintes techniques, les attentes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Plus la description est précise, plus vous recevrez de candidatures pertinentes
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mots-clés du projet
                    <span className="text-xs text-gray-500 ml-2">(Améliore la visibilité)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: électricité, plomberie, toiture, isolation"
                    value={motsCles}
                    onChange={(e) => setMotsCles(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Séparez par des virgules</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objectifs principaux
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Respect des délais, qualité premium, économie d'énergie"
                    value={objectifs}
                    onChange={(e) => setObjectifs(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Spécifications Techniques */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <RiToolsLine className="text-primary mr-3" /> Spécifications Techniques
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget estimé *
                    <span className="text-red-500 text-xs ml-1">(Obligatoire)</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      required
                      min="0"
                      step="100"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: 150000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                    <select
                      className="px-3 py-2 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                      value={budgetUnit}
                      onChange={(e) => setBudgetUnit(e.target.value)}
                    >
                      <option value="forfait">€ (Forfait)</option>
                      <option value="horaire">€/heure</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Budget total estimé pour le projet complet
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface concernée
                    <span className="text-xs text-gray-500 ml-2">(si applicable)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: 250"
                    value={surface}
                    onChange={(e) => setSurface(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Surface en m²</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exigences spécifiques
                  <span className="text-xs text-gray-500 ml-2">(Contraintes techniques, normes, etc.)</span>
                </label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Ex: Respect de la norme RT2012, accessibilité PMR, utilisation de matériaux écologiques..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>

              {/* Documents techniques */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documents techniques
                  <span className="text-xs text-gray-500 ml-2">(Plans, cahier des charges, etc.)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <RiUploadCloud2Line className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Glissez-déposez vos fichiers ici ou</p>
                  <label className="text-primary hover:text-primary/80 text-sm font-medium cursor-pointer">
                    parcourir
                    <input 
                      type="file" 
                      multiple 
                      accept=".pdf,.dwg,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, setDocumentsTechniques)} 
                      className="hidden" 
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, DWG, JPG, PNG jusqu'à 10 MB par fichier</p>
                </div>

                {documentsTechniques.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documentsTechniques.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFile(index, setDocumentsTechniques)} 
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <RiCloseLine />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Critères de Sélection */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                <RiCheckboxLine className="text-primary mr-3" /> Critères de Sélection
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Définissez les critères d'évaluation des candidatures (optionnel mais recommandé)
              </p>
              
              <div className="space-y-4">
                {criteres.map((critere, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Ex: Expérience dans le domaine, prix, délais"
                      value={critere.label}
                      onChange={(e) =>
                        setCriteres(prev =>
                          prev.map((item, i) =>
                            i === index ? { ...item, label: e.target.value } : item
                          )
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Poids %"
                      value={critere.pourcentage}
                      onChange={(e) => {
                        const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), 100);
                        setCriteres(prev =>
                          prev.map((item, i) =>
                            i === index ? { ...item, pourcentage: value } : item
                          )
                        );
                      }}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                    />
                    <button
                      type="button"
                      className="text-green-500 hover:text-green-700 p-1"
                      title="Valider"
                      onClick={() => handleValidateCritere(index)}
                    >
                      ✅
                    </button>
                    <button
                      type="button"
                      onClick={() => setCriteres(prev => prev.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <RiCloseLine />
                    </button>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-2">
                  <p className="text-sm text-gray-500">
                    Total : {criteres.reduce((sum, c) => sum + Number(c.pourcentage || 0), 0)}%
                  </p>
                  {criteres.reduce((sum, c) => sum + Number(c.pourcentage || 0), 0) > 100 && (
                    <p className="text-sm text-red-500">⚠️ Le total ne peut pas dépasser 100%</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications requises
                  <span className="text-xs text-gray-500 ml-2">(Diplômes, certifications, expérience)</span>
                </label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Ex: CAP/BEP dans le bâtiment, 5 ans d'expérience minimum, certification Qualibat..."
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                />
              </div>
            </section>

            {/* Documents à Joindre */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <RiAttachmentLine className="text-primary mr-3" /> Documents Complémentaires
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Autres documents
                  <span className="text-xs text-gray-500 ml-2">(Devis type, réglementation, etc.)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <RiUploadCloud2Line className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Glissez-déposez vos fichiers ici ou</p>
                  <label className="text-primary hover:text-primary/80 text-sm font-medium cursor-pointer">
                    parcourir
                    <input 
                      type="file" 
                      multiple 
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, setDocumentsJoindre)} 
                      className="hidden" 
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, DOC, XLS, JPG, PNG</p>
                </div>

                {documentsJoindre.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documentsJoindre.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index, setDocumentsJoindre)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <RiCloseLine />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() =>
                  navigate('/previsualisation-appel', {
                    state: {
                      reference, titre, description, localisation, budget, budgetUnit,
                      dateLimite, motsCles, objectifs, surface, typeConstruction,
                      qualifications, requirements, criteres, documentsTechniques, documentsJoindre
                    }
                  })
                }
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                disabled={loading}
              >
                Prévisualiser
              </button>

              <div className="flex items-center space-x-4">
                <Link
                  to="/dashbord-appels-offre"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Annuler
                </Link>
                
                <button
                  type="submit"
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
                      <span>📝</span>
                      <span>Publier l'Appel d'Offre</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AppelOffreCreation;
