// src/pages/DashboardAdmin/components/SidebarAdmin.jsx
import React from 'react';
import {
  RiDashboardLine,
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiAlertLine,
  RiSearchLine,
  RiBarChartLine,
  RiSettingsLine,
  RiCloseLine,
} from 'react-icons/ri';

function SidebarAdmin({ active, setActive, open, onClose }) {
  const menuItems = [
    { id: 'dashboard', label: "Vue d'ensemble", icon: RiDashboardLine },
    { id: 'entreprises', label: 'Utilisateurs', icon: RiUserLine },
    { id: 'paiements', label: 'Paiements', icon: RiMoneyDollarCircleLine },
    { id: 'litiges', label: 'Litiges', icon: RiAlertLine },
    { id: 'scraping', label: 'Scraping', icon: RiSearchLine },
    { id: 'statistiques', label: 'Statistiques', icon: RiBarChartLine },
    { id: 'parametres', label: 'Paramètres', icon: RiSettingsLine },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out`}
    >
      {/* Bouton de fermeture (mobile uniquement) */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <h2 className="text-xl font-bold text-primary">Marchés BTP</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <RiCloseLine size={24} />
        </button>
      </div>

      {/* Logo + rôle (desktop) */}
      <div className="p-6 hidden lg:block">
        <h2 className="text-2xl font-bold text-primary font-['Pacifico'] mb-2">Marchés BTP</h2>
        <p className="text-sm text-gray-500">Espace Admin</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActive(id);
              if (onClose) onClose(); // Fermer en mobile après clic
            }}
            className={`flex items-center w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${
              active === id
                ? 'bg-blue-50 text-primary'
                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default SidebarAdmin;