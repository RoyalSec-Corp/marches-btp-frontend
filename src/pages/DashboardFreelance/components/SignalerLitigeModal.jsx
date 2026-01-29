import React, { useState } from 'react';

function SignalerLitigeModal({ onClose }) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (!message.trim()) { alert('Veuillez decrire le litige avant de soumettre.'); return; }
    console.log('Litige soumis :', message);
    if (file) console.log('Fichier joint :', file.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Signaler un litige</h2>
        <textarea rows="6" className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 resize-none" placeholder="Decrivez le probleme rencontre avec cette mission ou ce contrat..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ajouter un document (optionnel)</label>
          <input type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} className="text-sm text-gray-600" />
          {file && <p className="text-xs text-gray-500 mt-1">Fichier selectionne : {file.name}</p>}
        </div>
        <div className="flex justify-between items-center">
          <button className="text-sm text-blue-600 hover:underline" onClick={() => alert("Appel de l'assistance...")}>\ud83d\udcde Appeler l'assistance</button>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" onClick={onClose}>Annuler</button>
            <button className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700" onClick={handleSubmit}>Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignalerLitigeModal;
