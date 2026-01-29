import React, { useState } from 'react';
import TransactionDetailsModal from './TransactionDetailsModal';

function TransactionsRecents() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const transactions = [
    {
      id: '#TXN-2847',
      client: 'Antoine Moreau',
      entreprise: 'Martin Construction SARL',
      montant: '€2,500',
      commission: '€250',
      statut: 'Complété',
      statutColor: 'green',
      date: '22 Juillet 2025',
      moyenPaiement: 'Carte bancaire',
    },
    {
      id: '#TXN-2846',
      client: 'Claire Dubois',
      entreprise: 'Dubois & Fils SARL',
      montant: '€1,800',
      commission: '€180',
      statut: 'En cours',
      statutColor: 'yellow',
      date: '21 Juillet 2025',
      moyenPaiement: 'Carte bancaire',
    },
    {
      id: '#TXN-2845',
      client: 'Nicolas Bernard',
      entreprise: 'Bernard Travaux Publics',
      montant: '€3,200',
      commission: '€320',
      statut: 'Complété',
      statutColor: 'green',
      date: '20 Juillet 2025',
      moyenPaiement: 'Carte bancaire',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 mt-6">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Transactions Récentes</h3>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
          Exporter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3">Transaction</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Entreprise</th>
              <th className="px-6 py-3">Montant</th>
              <th className="px-6 py-3">Commission</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((txn, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{txn.id}</td>
                <td className="px-6 py-4 text-gray-900">{txn.client}</td>
                <td className="px-6 py-4 text-gray-900">{txn.entreprise}</td>
                <td className="px-6 py-4 text-gray-900">{txn.montant}</td>
                <td className="px-6 py-4 text-gray-900">{txn.commission}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 bg-${txn.statutColor}-100 text-${txn.statutColor}-800 text-xs font-medium rounded`}
                  >
                    {txn.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedTransaction(txn)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

export default TransactionsRecents;