// src/pages/DashboardAdmin/components/PaiementsAdmin.jsx
import React, { useState } from 'react';

function PaiementsAdmin() {
  const [selectedPaiement, setSelectedPaiement] = useState(null);

  const paiements = [
    {
      id: 'PMT-001',
      entreprise: 'Dubois & Fils',
      freelance: 'Jean Morel',
      montant: '€1,500',
      methode: 'Carte',
      date: '15/07/2025',
      statut: 'Complété',
      statutColor: 'green',
    },
    {
      id: 'PMT-002',
      entreprise: 'Martin Construction',
      freelance: 'Sarah Lefevre',
      montant: '€2,100',
      methode: 'Virement',
      date: '14/07/2025',
      statut: 'En cours',
      statutColor: 'yellow',
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Historique des Paiements</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID Paiement</th>
              <th className="px-4 py-3">Entreprise</th>
              <th className="px-4 py-3">Freelance</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Méthode</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paiements.map((pmt) => (
              <tr key={pmt.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{pmt.id}</td>
                <td className="px-4 py-3">{pmt.entreprise}</td>
                <td className="px-4 py-3">{pmt.freelance}</td>
                <td className="px-4 py-3">{pmt.montant}</td>
                <td className="px-4 py-3">{pmt.methode}</td>
                <td className="px-4 py-3">{pmt.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 bg-${pmt.statutColor}-100 text-${pmt.statutColor}-800 text-xs font-medium rounded`}>
                    {pmt.statut}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="text-blue-600 hover:text-blue-900 text-sm"
                    onClick={() => setSelectedPaiement(pmt)}
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPaiement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Détails du Paiement</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>ID :</strong> {selectedPaiement.id}</li>
              <li><strong>Entreprise :</strong> {selectedPaiement.entreprise}</li>
              <li><strong>Freelance :</strong> {selectedPaiement.freelance}</li>
              <li><strong>Montant :</strong> {selectedPaiement.montant}</li>
              <li><strong>Méthode :</strong> {selectedPaiement.methode}</li>
              <li><strong>Date :</strong> {selectedPaiement.date}</li>
              <li><strong>Statut :</strong> {selectedPaiement.statut}</li>
            </ul>
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                onClick={() => setSelectedPaiement(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaiementsAdmin;