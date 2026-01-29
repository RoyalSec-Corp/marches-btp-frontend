import React from 'react';
import { RiCloseLine, RiStarFill } from 'react-icons/ri';

const FreelanceProfileModal = ({ freelance, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profil du Freelance</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <RiCloseLine className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {freelance?.prenom?.charAt(0) || ''}{freelance?.nom?.charAt(0) || 'F'}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{freelance?.nom || 'Freelance'}</h3>
              <p className="text-gray-600">{freelance?.specialite || 'Professionnel BTP'}</p>
              <div className="flex items-center justify-center mt-2 space-x-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (<RiStarFill key={i} />))}
                <span className="ml-2 text-gray-600 text-sm">{freelance?.note || 0} ({freelance?.projets || 0} avis)</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Tarif et Disponibilite</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tarif journalier</span>
                    <span className="font-medium">{freelance?.tarif || 'N/A'} EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disponibilite</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${freelance?.disponible ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {freelance?.disponible ? 'Disponible' : 'Occupe'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">A propos</h4>
              <p className="text-gray-700 text-sm">{freelance?.description || 'Aucune description disponible.'}</p>
            </div>
            {freelance?.skills && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Competences</h4>
                <div className="flex flex-wrap gap-2">
                  {freelance.skills.map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelanceProfileModal;
