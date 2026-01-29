// src/pages/DashboardAdmin/components/VerificationModal.jsx
import React, { useState } from 'react';
import { RiCloseLine, RiEyeLine } from 'react-icons/ri';
import DocumentViewer from './DocumentViewer';

function VerificationModal({ user, onClose }) {
  const [viewerUrl, setViewerUrl] = useState(null);

  // Documents simulés
  const documents = [
    { label: "Pièce d'identité", url: '/docs/piece-identite.pdf' },
    { label: "Extrait Kbis / SIRET", url: '/docs/kbis.pdf' },
    { label: "Assurance RC", url: '/docs/assurance.pdf' },
    { label: "Justificatifs de compétences", url: '/docs/competences.jpg' }
  ];

  if (!user) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <RiCloseLine size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Vérification des informations de {user.nom}
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Type :</h3>
              <p className="text-sm text-gray-800">
                {user.type === 'entreprise' ? 'Entreprise BTP' : 'Freelance'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Domaine :</h3>
              <p className="text-sm text-gray-800">{user.domaine}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Date d'inscription :</h3>
              <p className="text-sm text-gray-800">{user.date}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Documents justificatifs :</h3>
              <ul className="space-y-2">
                {documents.map((doc, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded border"
                  >
                    <span>{doc.label}</span>
                    <button
                      onClick={() => setViewerUrl(doc.url)}
                      className="text-primary hover:underline flex items-center text-sm"
                    >
                      <RiEyeLine className="mr-1" /> Voir
                    </button>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-2">(Les documents sont fictifs ici. L’intégration réelle se fera via le backend)</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
            >
              Fermer
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 text-sm">
              Valider les documents
            </button>
          </div>
        </div>
      </div>

      {viewerUrl && (
        <DocumentViewer fileUrl={viewerUrl} onClose={() => setViewerUrl(null)} />
      )}
    </>
  );
}

export default VerificationModal;