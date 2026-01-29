import React from 'react';
import { RiUserLine, RiMenuLine } from 'react-icons/ri';
import NotificationBell from '../../../components/NotificationBell';

function Header({ onToggleSidebar, onOpenNotifications }) {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-700 border-b border-gray-200 px-4 py-4 flex items-center justify-between lg:px-6 sticky top-0 z-30">
      <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100" title="Menu"><RiMenuLine className="w-6 h-6" /></button>
      <h1 className="text-lg md:text-xl font-semibold text-white hidden lg:block">Bienvenue sur votre espace Auto-entrepreneur</h1>
      <div className="flex items-center space-x-4">
        <NotificationBell onClick={onOpenNotifications} pollMs={30000} />
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600" title="Mon profil"><RiUserLine /></div>
      </div>
    </header>
  );
}

export default Header;
