// src/pages/DashboardAdmin/components/ParametresAdmin.jsx
import React, { useState } from 'react';

function ParametresAdmin() {
  const [email, setEmail] = useState('admin@marchesbtp.fr');
  const [telephone, setTelephone] = useState('01 23 45 67 89');
  const [motDePasse, setMotDePasse] = useState('');

  const handleSave = () => {
    console.log('Changements enregistrés :', { email, telephone, motDePasse });
    alert('Paramètres mis à jour avec succès.');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Paramètres Administrateur</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

export default ParametresAdmin;