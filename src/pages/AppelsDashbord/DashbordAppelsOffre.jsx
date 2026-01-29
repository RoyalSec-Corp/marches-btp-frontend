import React, { useState, useRef } from "react";
import HeaderAppel from "./components/HeaderAppel";
import StatCards from "./components/StatCards";
import OffersChart from "./components/OffersChart";
import BudgetChart from "./components/BudgetChart";
import FiltresDynamiques from "./components/FiltresDynamiques";
import TableAppelsOffres from "./components/TableAppelsOffres";
import FreelancesRecommandes from "./components/FreelancesRecommandes";
import EntreprisesPartenaires from "./components/EntreprisesPartenaires";
import FloatingMenu from "./components/FloatingMenu";
import SectionFreelances from "./components/SectionFreelances";
import SectionEntreprises from "./components/SectionEntreprises";
import SectionCandidatures from "./components/SectionCandidatures";
import Messages from "./components/Messages";
import DetailsCandidature from "./components/DetailsCandidature";
import ReferralDashboard from "../Parrainage/ReferralDashboard.jsx";
import FactureAppelOffre from "./components/FactureAppelOffre";
import Paiement from "./components/SuiviFactures.jsx";


const DashboardAppelOffres = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [messageDest, setMessageDest] = useState("");
  const [messageData, setMessageData] = useState(null); // Pour stocker les données de la conversation
  const [candidatureDetail, setCandidatureDetail] = useState(null);
  const candidaturesRef = useRef(null);

  const setActiveSectionWithDest = (section, data = "") => {
    setActiveSection(section);
    if (section === "messages") {
      // Si data est un objet messageData complet, l'utiliser
      if (typeof data === 'object' && data.appel_offre_id) {
        setMessageData(data);
        setMessageDest(data.candidat_nom || data.freelance_name || 'Utilisateur');
      } else {
        // Sinon, c'est l'ancien format avec juste le nom
        setMessageDest(data);
      }
    } else if (section === "detailsCandidature") {
      setCandidatureDetail(data);
    } else if (section === "factureAppelOffre") {
      setCandidatureDetail(data);
    }
    };

  // Fonction pour rafraîchir les candidatures
  const handleUpdateCandidatures = () => {
    if (candidaturesRef.current && candidaturesRef.current.loadUserApplications) {
      candidaturesRef.current.loadUserApplications();
    }
  };

  // Fonction pour ouvrir la messagerie avec un destinataire spécifique
  const handleOpenMessage = (freelanceName, candidatureData) => {
    console.log('Ouverture de la messagerie avec:', freelanceName, candidatureData);
    
    // Extraire les informations nécessaires pour la conversation
    const messageInfo = {
      appel_offre_id: candidatureData?.appel_offre_id || candidatureData?.id,
      candidature_id: candidatureData?.candidature_id || candidatureData?.id,
      freelance_name: freelanceName,
      appel_offre_titre: candidatureData?.titre || candidatureData?.appel_offre_titre
    };
    
    setMessageData(messageInfo);
    setMessageDest(freelanceName);
    setActiveSection("messages");
  };

  return (
    <div>
      <HeaderAppel
        onCreateAppel={() => console.log("Créer un appel d'offre")}
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />

      {activeSection === "dashboard" && (
        <div className="px-6 py-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500">
          <StatCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <OffersChart />
            <BudgetChart />
          </div>
          <FiltresDynamiques />
          <TableAppelsOffres />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <FreelancesRecommandes />
            <EntreprisesPartenaires />
          </div>
          <FloatingMenu />
        </div>
      )}

      {activeSection === "freelances" && <SectionFreelances />}
      {activeSection === "entreprises" && <SectionEntreprises />}
      {activeSection === "candidatures" && (
        <SectionCandidatures 
          ref={candidaturesRef}
          setActiveSectionWithDest={setActiveSectionWithDest} 
        />
      )}
      {activeSection === "messages" && (
        <Messages 
          destinataire={messageDest}
          appel_offre_id={messageData?.appel_offre_id}
          candidature_id={messageData?.candidature_id}
        />
      )}
      {activeSection === "detailsCandidature" && (
        <DetailsCandidature
          data={candidatureDetail}
          onBack={() => setActiveSection("candidatures")}
          onUpdate={handleUpdateCandidatures}
          onOpenMessage={handleOpenMessage}
        />
      )}
      {activeSection === "factureAppelOffre" && (
        <FactureAppelOffre
          data={candidatureDetail}
          onBack={() => setActiveSection("candidatures")}
        />
      )}

      {activeSection === "paiement" && <Paiement />}

      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500">{activeSection === "parrainage" && <ReferralDashboard />}</div>
    </div>
  );
};

export default DashboardAppelOffres;
