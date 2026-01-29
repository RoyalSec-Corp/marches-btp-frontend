import React from 'react';
import { RiDashboardLine, RiUserLine, RiFileTextLine, RiMegaphoneLine, RiSettingsLine, RiAddLine, RiCloseLine, RiNotificationLine, RiMessage3Line, RiGiftLine, RiLogoutBoxRLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';

function Sidebar({ active, setActive, open, onClose }) {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: RiDashboardLine },
    { id: 'freelances', label: 'Auto-entrepreneurs', icon: RiUserLine },
    { id: 'contrats', label: 'Contrats', icon: RiFileTextLine },
    { id: 'notifications', label: 'Notifications', icon: RiNotificationLine },
    { id: 'appels', label: "Appels d'Offres", icon: RiMegaphoneLine },
    { id: 'messages', label: 'Messages AO', icon: RiMessage3Line },
    { id: 'gestion-candidatures', label: 'Candidatures', icon: RiFileTextLine },
    { id: 'parrainage', label: 'Parrainage', icon: RiGiftLine },
    { id: 'parametres', label: 'Parametres', icon: RiSettingsLine }
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-800 border-r border-gray-200 z-40 transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out flex flex-col justify-between`}>
      <div className="flex items-center justify-between p-4 lg:hidden"><h2 className="text-xl font-bold text-white">Marches BTP</h2><button onClick={onClose} className="text-gray-600 hover:text-gray-900"><RiCloseLine size={24} /></button></div>
      <div className="p-6 hidden lg:block"><h2 className="text-2xl font-bold text-white font-['Pacifico'] mb-2">Marches BTP</h2><p className="text-sm text-white">Espace Entreprise</p></div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map(({ id, label, icon: Icon }) => (<button key={id} onClick={() => { setActive(id); if (onClose) onClose(); }} className={`flex items-center w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${active === id ? 'bg-blue-500 text-white' : 'text-white hover:text-white/80 hover:bg-blue-600'}`}><Icon className="w-5 h-5 mr-3" />{label}</button>))}
        <button onClick={() => authService.logout('/')} className="mt-2 flex items-center w-full px-4 py-3 rounded-lg font-medium text-sm text-red-600 hover:text-white hover:bg-red-500 transition-all"><RiLogoutBoxRLine className="w-5 h-5 mr-3" />Deconnexion</button>
      </nav>
      <div className="p-4 border-t border-gray-100"><button onClick={() => navigate('/creation-contrat')} className="w-full bg-orange-500 text-white px-4 py-3 rounded-button font-medium hover:bg-blue-600 transition-colors"><div className="inline-flex items-center"><RiAddLine className="mr-2" />Creer un contrat</div></button></div>
    </aside>
  );
}

export default Sidebar;
