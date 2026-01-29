import React, { useState } from "react";
import {
  RiArrowLeftLine,
  RiUser3Line,
  RiFileTextLine,
  RiAttachment2,
  RiCheckLine,
  RiCloseLine,
  RiDownloadLine,
  RiEyeLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiMessage3Line,
} from "react-icons/ri";
import { toast } from 'react-toastify';
import callsForTendersApi from '../../../services/callsForTendersApi';

const DetailsCandidature = ({ data, onBack, onUpdate, onOpenMessage }) => {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(data?.statut || 'Nouveau');
  
  if (!data) return null;

  // Documents de la candidature - connectés aux vraies données
  const documents = data.documents_soumission || [];

  // Fonction pour accepter une candidature
  const handleAccept = async () => {
    if (!data.appel_offre?.id || !data.id) {
      toast.error('Données manquantes pour accepter la candidature');
      return;
    }

    try {
      setLoading(true);
      await callsForTendersApi.acceptApplication(data.appel_offre.id, data.id);
      
      // Mettre à jour le statut local immédiatement
      setCurrentStatus('Accepté');
      
      toast.success('Candidature acceptée avec succès');
      
      // Mettre à jour les données dans le parent
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Erreur acceptation candidature:', err);
      toast.error('Erreur lors de l\'acceptation de la candidature');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour refuser une candidature
  const handleReject = async () => {
    if (!data.appel_offre?.id || !data.id) {
      toast.error('Données manquantes pour refuser la candidature');
      return;
    }

    try {
      setLoading(true);
      await callsForTendersApi.rejectApplication(data.appel_offre.id, data.id);
      
      // Mettre à jour le statut local immédiatement
      setCurrentStatus('Refusé');
      
      toast.success('Candidature refusée');
      
      // Mettre à jour les données dans le parent
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Erreur refus candidature:', err);
      toast.error('Erreur lors du refus de la candidature');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ouvrir la messagerie
  const handleOpenMessage = () => {
    if (onOpenMessage && data.freelance) {
      // Extraire le nom du freelance pour la conversation
      const freelanceName = data.freelance;
      
      // Construire l'objet avec les informations nécessaires pour la messagerie
      const candidatureInfo = {
        id: data.id,
        candidature_id: data.id,
        appel_offre_id: data.appel_offre?.id || data.appel_offre_id,
        appel_offre_titre: data.appel_offre?.titre || data.nom,
        freelance: data.freelance,
        titre: data.appel_offre?.titre || data.nom
      };
      
      console.log('Données passées pour la messagerie:', candidatureInfo);
      onOpenMessage(freelanceName, candidatureInfo);
    }
  };

  return (
    <div className="px-6 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-blue-600 hover:underline"
      >
        <RiArrowLeftLine className="mr-2" />
        Retour à la liste
      </button>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Détail de la candidature
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
          <div className="flex items-center gap-2">
            <RiUser3Line className="text-primary" />
            <span className="font-medium">Freelance :</span>
            <span>{data.freelance}</span>
          </div>
          <div className="flex items-center gap-2">
            <RiFileTextLine className="text-primary" />
            <span className="font-medium">Projet :</span>
            <span>{data.nom}</span>
          </div>
          <div className="flex items-center gap-2">
            <RiFileTextLine className="text-primary" />
            <span className="font-medium">Date :</span>
            <span>{data.date}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">Proposition :</h2>
          <p className="text-gray-700">{data.proposition}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">Documents joints :</h2>
          {documents.length > 0 ? (
            <ul className="space-y-2">
              {documents.map((doc, i) => (
                <li key={i} className="flex items-center justify-between bg-gray-50 border px-4 py-2 rounded-md">
                  <div className="flex items-center gap-2 text-gray-700">
                    <RiAttachment2 className="text-blue-600" />
                    <span>{doc.nom_fichier || doc.name || `Document ${i + 1}`}</span>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={doc.chemin_fichier || doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                    >
                      <RiEyeLine /> Voir
                    </a>
                    <a
                      href={doc.chemin_fichier || doc.url}
                      download
                      className="text-gray-600 text-sm flex items-center gap-1 hover:underline"
                    >
                      <RiDownloadLine /> Télécharger
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Aucun document joint à cette candidature.</p>
          )}
        </div>

        {/* Informations complémentaires */}
        {(data.budget_propose || data.duree_proposee) && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800 mb-3">Informations complémentaires :</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.budget_propose && (
                <div className="flex items-center gap-2">
                  <RiMoneyDollarCircleLine className="text-green-600" />
                  <span className="font-medium">Budget proposé :</span>
                  <span className="text-green-700 font-semibold">{data.budget_propose} €</span>
                </div>
              )}
              {data.duree_proposee && (
                <div className="flex items-center gap-2">
                  <RiCalendarLine className="text-blue-600" />
                  <span className="font-medium">Durée proposée :</span>
                  <span className="text-blue-700 font-semibold">{data.duree_proposee}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statut de la candidature */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Statut actuel :</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentStatus === 'Accepté' ? 'bg-green-100 text-green-700' :
              currentStatus === 'Refusé' ? 'bg-red-100 text-red-700' :
              currentStatus === 'Nouveau' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {currentStatus || 'En attente'}
            </span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-4">
          {currentStatus === 'Nouveau' && (
            <div className="flex gap-4">
              <button 
                onClick={handleAccept}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RiCheckLine />
                {loading ? 'En cours...' : 'Accepter la candidature'}
              </button>
              <button 
                onClick={handleReject}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RiCloseLine />
                {loading ? 'En cours...' : 'Refuser la candidature'}
              </button>
            </div>
          )}
          
          {/* Bouton Message - toujours disponible */}
          <div className="flex gap-4">
            <button 
              onClick={handleOpenMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition"
            >
              <RiMessage3Line />
              Contacter le freelance
            </button>
          </div>
        </div>
        
        {currentStatus !== 'Nouveau' && (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-600">
              Cette candidature a déjà été {currentStatus === 'Accepté' ? 'acceptée' : currentStatus === 'Refusé' ? 'refusée' : 'traitée'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsCandidature;
