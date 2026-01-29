import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

function TransactionDetailsModal({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <RiCloseLine size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails de la transaction</h2>

        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <span className="font-medium">ID :</span> {transaction.id}
          </div>
          <div>
            <span className="font-medium">Client :</span> {transaction.client}
          </div>
          <div>
            <span className="font-medium">Entreprise :</span> {transaction.entreprise}
          </div>
          <div>
            <span className="font-medium">Montant :</span> {transaction.montant}
          </div>
          <div>
            <span className="font-medium">Commission :</span> {transaction.commission}
          </div>
          <div>
            <span className="font-medium">Statut :</span>{' '}
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                transaction.statut === 'Complété'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {transaction.statut}
            </span>
          </div>
          <div>
            <span className="font-medium">Date :</span> {transaction.date || 'Non renseignée'}
          </div>
          <div>
            <span className="font-medium">Moyen de paiement :</span>{' '}
            {transaction.moyenPaiement || 'Carte bancaire'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsModal;