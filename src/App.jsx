import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/Accueil/HomePage';
import EntrepriseRegister from './pages/Entreprise/EntrepriseRegister';
import FreelanceRegister from './pages/Freelance/FreelanceRegister';
import Inscription from './pages/Inscription/Inscription';
import Connexion from './pages/Connexion/Connexion';
import DetailsAppel from './pages/Appels/DetailsAppel';
import CreationContrat from './pages/Contrats/CreationContrat';
import DetailsContrat from './pages/Contrats/DetailsContrat';
import SignerContrat from './pages/Contrats/SignerContrat';
import DashboardEntreprise from './pages/DashboardEntreprise/DashboardEntreprise';
import DashboardFreelance from './pages/DashboardFreelance/DashboardFreelance';
import DashboardAdmin from './pages/DashboardAdmin/DashboardAdmin';
import DashbordAppelsOffre from './pages/AppelsDashbord/DashbordAppelsOffre';
import AppelOffreCreation from './pages/AppelOffre/AppelOffreCreation';
import PrevisualisationAppelOffre from './pages/Appels/PrevisualisationAppel';
import InscriptionAppelOffre from './pages/InscriptionAppelOffre';
import ConnexionAdmin from './pages/ConnexionAdmin/ConnexionAdmin';
import FacturePage from './pages/AppelsDashbord/components/FacturePage';
import FactureDetail from './pages/AppelsDashbord/components/FactureDetail';
import MotDePasseOublie from './pages/Connexion/MotDePasseOublie';
import ReinitialiserMotDePasse from './pages/Connexion/ReinitialiserMotDePasse';

function App() {
  return (
    <>
      <Routes>
        {/* Accueil */}
        <Route path="/" element={<HomePage />} />
        <Route path="/accueil" element={<Navigate to="/" replace />} />

        {/* Pages Appels d'Offres */}
        <Route path="/inscription-appel-offre" element={<InscriptionAppelOffre />} />
        <Route path="/previsualisation-appel" element={<PrevisualisationAppelOffre />} />
        <Route path="/appel-offre" element={<AppelOffreCreation />} />
        <Route path="/details-appel" element={<DetailsAppel />} />

        {/* Facture */}
        <Route path="/facture" element={<FacturePage />} />
        <Route path="/facture/:id" element={<FactureDetail />} />

        {/* Authentification */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/inscription-freelance" element={<FreelanceRegister />} />
        <Route path="/inscription-entreprise" element={<EntrepriseRegister />} />
        <Route path="/connexion-admin" element={<ConnexionAdmin />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />

        {/* Contrats */}
        <Route path="/creation-contrat" element={<CreationContrat />} />
        <Route path="/details-contrat" element={<DetailsContrat />} />
        <Route path="/details-contrat/:id" element={<DetailsContrat />} />
        <Route path="/signer-contrat" element={<SignerContrat />} />
        <Route path="/signer-contrat/:id" element={<SignerContrat />} />

        {/* Dashboards */}
        <Route path="/dashboard-entreprise" element={<DashboardEntreprise />} />
        <Route path="/dashbord-appels-offre" element={<DashbordAppelsOffre />} />
        <Route path="/dashboard-appels" element={<Navigate to="/dashbord-appels-offre" replace />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-freelance" element={<DashboardFreelance />} />

        {/* Redirection pour routes inexistantes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
