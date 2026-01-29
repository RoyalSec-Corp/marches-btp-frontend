import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLoader4Line } from 'react-icons/ri';

// Composants de structure
import SidebarAdmin from './components/SidebarAdmin';
import HeaderAdmin from './components/HeaderAdmin';

// Composants Intelligents (Widgets)
import GestionUtilisateurs from './components/GestionUtilisateurs';
import StatistiquesAdmin from './components/StatistiquesAdmin';
import ScrapingSources from './components/ScrapingSources'; // Le Widget
import MapAnalytics from './components/MapAnalytics'; 
import LitigesAdmin from './components/LitigesAdmin';

// ✅ IMPORT DE L'OUTIL COMPLET
import ScrappingAdmin from './components/ScrappingAdmin';

import adminApi from '../../services/adminApi';

function DashboardAdmin() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Données Backend
  const [stats, setStats] = useState(null);
  const [mapData, setMapData] = useState({ entreprises: [], freelances: [], offres: [] });
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Navigation guard : vérification basique de l'auth
    const user = localStorage.getItem('user');
    if (!user) {
        navigate('/connexion');
        return;
    }

    const fetchData = async () => {
      console.log("🚀 CHARGEMENT DASHBOARD...");

      try {
        setLoading(true);

        const [statsRes, mapRes] = await Promise.all([
             adminApi.getStats().catch(err => {
                 console.error("❌ Erreur Stats:", err);
                 return null;
             }),
             adminApi.getMapData().catch(err => {
                 console.error("❌ Erreur Carte:", err);
                 return { entreprises: [], freelances: [], offres: [] };
             })
        ]);

        if (statsRes) setStats(statsRes);
        if (mapRes) setMapData(mapRes);

      } catch (err) {
        console.error("☠️ Erreur critique:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  // --- LOGIQUE D'AFFICHAGE ---
  const renderContent = () => {
    if (loading) return <div className="flex h-96 items-center justify-center"><RiLoader4Line className="animate-spin text-4xl text-primary" /></div>;
    
    const displayStats = stats || { counts: { total: 0, freelances: 0, entreprises: 0 }, revenue: 0 };

    switch (activeSection) {
      
      // --- 1. VUE D'ENSEMBLE (Widgets) ---
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fadeIn">
              {/* Stats globales */}
              <div>
                <StatistiquesAdmin stats={displayStats} />
              </div>

              {/* Carte Interactive */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <MapAnalytics liveData={mapData} />
              </div>

              {/* Grille inférieure */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <GestionUtilisateurs users={displayStats.users ? displayStats.users.slice(0, 5) : []} mode="widget" />
                </div>
                <div className="lg:col-span-1">
                   {/* ✅ LE WIDGET : On passe la fonction pour changer d'onglet */}
                   <ScrapingSources 
                      data={displayStats.scraping} 
                      onViewDetails={() => setActiveSection('scraping')} 
                   />
                </div>
              </div>
          </div>
        );

      // --- 2. GESTION UTILISATEURS ---
      case 'entreprises': 
        return <GestionUtilisateurs mode="table" />;

      // --- 3. STATISTIQUES DÉTAILLÉES ---
      case 'statistiques':
        return <StatistiquesAdmin stats={displayStats} />;

      // --- 4. SCRAPING (OUTIL COMPLET) ---
      case 'scraping':
        // ✅ On affiche ici le Grand Terminal (ScrappingAdmin)
        return <ScrappingAdmin />;

      // --- 5. TRIBUNAL ---
      case 'litiges':
        return <LitigesAdmin />;

      default:
        return <div className="p-10 text-center text-gray-500">Module en construction : {activeSection}</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform lg:translate-x-0 lg:static lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarAdmin active={activeSection} setActive={setActiveSection} />
      </div>
      
      {/* Overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
        <HeaderAdmin onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default DashboardAdmin;