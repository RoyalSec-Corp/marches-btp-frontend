import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import ActivityChart from './components/ActivityChart';
import RecentActivity from './components/RecentActivity';
import FreelanceSearch from './components/FreelanceSearch';
import OffresRecents from './components/OffresRecents';
import FreelanceList from './components/FreelanceList';
import ContratsList from './components/ContratsList';
import AppelsOffresList from './components/AppelsOffresList';
import ParametresEntreprise from './components/ParametresEntreprise';
import ModalCreationContrat from './components/ModalCreationContrat';
import CandidatureManager from '../../components/CandidatureManager';
import NotificationsEntreprise from './components/NotificationsEntreprise';
import MessagesEntreprise from './components/MessagesEntreprise';
import ReferralDashboard from '../Parrainage/ReferralDashboard';

function DashboardEntreprise() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const initialContractId = location.state?.contractId || Number(localStorage.getItem('lastCreatedContractId')) || null;
  const [selectedContractId, setSelectedContractId] = useState(initialContractId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (location.state?.section) setActiveSection(location.state.section); if (location.state?.contractId) { setSelectedContractId(location.state.contractId); localStorage.setItem('lastCreatedContractId', String(location.state.contractId)); } }, [location.state]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return (<><StatCards autoRefreshMs={30000} /><ActivityChart autoRefreshMs={30000} /><div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6"><RecentActivity autoRefreshMs={30000} /><div className="space-y-6"><FreelanceSearch /><OffresRecents autoRefreshMs={30000} /></div></div></>);
      case 'freelances': return <FreelanceList />;
      case 'contrats': return <ContratsList />;
      case 'gestion-candidatures': return (<div className="space-y-6"><h2 className="text-xl font-bold text-white">Gestion des candidatures</h2>{selectedContractId ? (<CandidatureManager contractId={selectedContractId} entrepriseId={1} />) : (<div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border rounded-lg p-6"><p className="text-white">Aucun contrat selectionne. Creez une mission ou ouvrez un contrat existant pour voir les candidatures.</p></div>)}</div>);
      case 'appels': return <AppelsOffresList />;
      case 'notifications': return <NotificationsEntreprise />;
      case 'messages': return <MessagesEntreprise />;
      case 'parrainage': return <ReferralDashboard />;
      case 'parametres': return <ParametresEntreprise />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #1d54ddff, #1e5ec4ff, #d46906ff)' }}>
      <div className="hidden lg:block"><Sidebar active={activeSection} setActive={setActiveSection} /></div>
      {sidebarOpen && (<div className="fixed inset-0 z-40 flex lg:hidden"><div className="w-64 bg-white border-r border-gray-200 shadow-lg"><Sidebar active={activeSection} setActive={(id) => { setActiveSection(id); setSidebarOpen(false); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /></div><div className="flex-1 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)} /></div>)}
      <div className="flex-1 lg:ml-64"><Header onMenuClick={() => setSidebarOpen(true)} onOpenNotifications={() => setActiveSection('notifications')} /><main className="p-6 space-y-6">{renderSection()}</main></div>
      {isModalOpen && <ModalCreationContrat onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default DashboardEntreprise;
