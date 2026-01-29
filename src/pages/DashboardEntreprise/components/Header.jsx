import React from 'react';
import { RiUserLine, RiMenuLine } from 'react-icons/ri';
import NotificationBell from '../../../components/NotificationBell';

function Header({ onMenuClick, onOpenNotifications }) {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-700 border-b border-gray-200 px-4 py-4 flex items-center justify-between lg:px-6">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"><RiMenuLine className="w-6 h-6" /></button>
      <div><h1 className="text-2xl font-bold text-white">Espace Entreprise</h1><p className="text-sm text-white">Gerez vos contrats et appels d'offres</p></div>
      <div className="flex items-center space-x-4"><NotificationBell onClick={onOpenNotifications} pollMs={30000} /><div className="flex items-center space-x-3"><div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">?</div><div><div className="text-sm font-medium text-white">Entreprise</div><div className="text-xs text-white">Utilisateur</div></div></div></div>
    </header>
  );
}

export default Header;
