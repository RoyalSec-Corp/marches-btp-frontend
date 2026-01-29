import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

function ModalCreationContrat({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><RiCloseLine className="w-6 h-6" /></button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Creer un contrat</h2>
        <form className="space-y-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom du freelance</label><input type="text" className="form-input w-full" placeholder="Ex : Jean Dupont" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Projet associe</label><input type="text" className="form-input w-full" placeholder="Titre de l'appel d'offres" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Date de debut</label><input type="date" className="form-input w-full" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Duree estimee</label><input type="text" className="form-input w-full" placeholder="Ex : 3 mois" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Montant du contrat</label><input type="text" className="form-input w-full" placeholder="Ex : \u20ac10,000" /></div>
          <div className="flex justify-end"><button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium">Enregistrer</button></div>
        </form>
      </div>
    </div>
  );
}

export default ModalCreationContrat;
