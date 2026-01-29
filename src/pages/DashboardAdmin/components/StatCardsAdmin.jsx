import React from 'react';
import {
  RiUserLine,
  RiMoneyEuroCircleLine,
  RiAlertLine,
  RiCheckLine,
} from 'react-icons/ri';

function StatCardsAdmin() {
  const stats = [
    {
      label: 'Entreprises BTP',
      value: '1,247',
      change: '+8% ce mois',
      icon: <RiUserLine className="text-blue-600 text-2xl" />,
      iconBg: 'bg-blue-100',
      trend: 'text-green-600',
    },
    {
      label: 'Montant Généré',
      value: '€1,2M',
      change: '+8% ce mois',
      icon: <RiMoneyEuroCircleLine className="text-green-600 text-2xl" />,
      iconBg: 'bg-green-100',
      trend: 'text-green-600',
    },
    {
      label: 'Litiges en Cours',
      value: '23',
      change: '+3 aujourd\'hui',
      icon: <RiAlertLine className="text-red-600 text-2xl" />,
      iconBg: 'bg-red-100',
      trend: 'text-red-600',
    },
    {
      label: 'Taux Validation',
      value: '94%',
      change: '+2% ce mois',
      icon: <RiCheckLine className="text-purple-600 text-2xl" />,
      iconBg: 'bg-purple-100',
      trend: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${stat.trend} mt-1`}>{stat.change}</p>
            </div>
            <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatCardsAdmin;