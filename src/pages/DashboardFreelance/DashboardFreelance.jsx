import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import DerniersChangements from './components/DerniersChangements';
import ActivityChart from './components/ActivityChart';
import ContratsListFreelance from './components/ContratsListFreelance';
import MissionsDisponibles from './components/MissionsDisponibles';
import AppelsOffresFreelance from './components/AppelsOffresFreelance';
import PaiementsFreelance from './components/PaiementsFreelance';
import ProfilFreelance from './components/ProfilFreelance';
import ParametresFreelance from './components/ParametresFreelance';
import MessagesFreelance from './components/MessagesFreelance';
import SignalerLitigeModal from './components/SignalerLitigeModal';
import NotificationPanel from '../../components/NotificationPanel';
import ReferralDashboard from '../Parrainage/ReferralDashboard';

function DashboardFreelance() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLitigeModal, setShowLitigeModal] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <StatCards autoRefreshMs={30000} />
            <ActivityChart autoRefreshMs={30000} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              <DerniersChangements autoRefreshMs={30000} />
              <div className="xl:col-span-2"></div>
            </div>
          </>
        );
      case 'missions': return <MissionsDisponibles />;
      case 'appels-offres': return <AppelsOffresFreelance />;
      case 'contrats': return <ContratsListFreelance />;
      case 'paiements': return <PaiementsFreelance autoRefreshMs={30000} />;
      case 'profil': return <ProfilFreelance />;
      case 'parametres': return <ParametresFreelance onOpenLitigeModal={() => setShowLitigeModal(true)} />;
      case 'messages': return <MessagesFreelance />;
      case 'parrainage': return <ReferralDashboard />;
      case 'notifications': return (<div className="space-y-6"><h2 className="text-xl font-bold text-white">Notifications</h2><NotificationPanel autoRefreshMs={30000} /></div>);
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #1d54ddff, #1e5ec4ff, #d46906ff)' }}>
      <div className="hidden lg:block"><Sidebar active={activeSection} setActive={setActiveSection} /></div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-64 border-r border-gray-200 shadow-lg"><Sidebar active={activeSection} setActive={(section) => { setActiveSection(section); setSidebarOpen(false); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /></div>
          <div className="flex-1 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      <div className="flex-1 lg:ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(true)} onOpenNotifications={() => setActiveSection('notifications')} />
        <main className="p-6 space-y-6">{renderSection()}</main>
      </div>
      {showLitigeModal && <SignalerLitigeModal onClose={() => setShowLitigeModal(false)} />}
    </div>
  );
}

export default DashboardFreelance;
