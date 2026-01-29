import React, { useState } from "react";
import { RiUser3Line, RiFileTextLine, RiMailSendLine, RiEyeLine, RiSearchLine } from "react-icons/ri";

const candidatures = [
  { id: 1, idEntreprise: "bouygues", nom: "Societe Genie BTP", date: "2025-08-04", freelance: "Yacine Kone", proposition: "Intervention en 3 jours sur site, 450\u20ac/jour, outils inclus", statut: "Nouveau" },
  { id: 2, idEntreprise: "eiffage", nom: "Travaux Express SARL", date: "2025-08-03", freelance: "Fatou Traore", proposition: "Deplacement prevu des lundi, devis joint. Tarif : 400\u20ac/jour", statut: "En evaluation" },
  { id: 3, idEntreprise: "vinci", nom: "Renov Pro", date: "2025-08-02", freelance: "Benoit Lefevre", proposition: "Realisation partielle possible - planning joint", statut: "Accepte" },
  { id: 4, idEntreprise: "leon-grosse", nom: "EcoTravaux Studio", date: "2025-08-01", freelance: "Andre Martin", proposition: "Travail a distance possible. Livraison sous 1 semaine.", statut: "Refuse" }
];

const getStatutStyle = (statut) => { switch (statut) { case "Nouveau": return "bg-blue-100 text-blue-700"; case "En evaluation": return "bg-yellow-100 text-yellow-700"; case "Accepte": return "bg-green-100 text-green-700"; case "Refuse": return "bg-red-100 text-red-700"; default: return "bg-gray-100 text-gray-600"; } };

const SectionCandidatures = ({ setActiveSectionWithDest }) => {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous les statuts");
  const [sortOrder, setSortOrder] = useState("Trier par date");

  const filtered = candidatures.filter((cand) => { const lower = search.toLowerCase(); return cand.nom.toLowerCase().includes(lower) || cand.freelance.toLowerCase().includes(lower); }).filter((cand) => { if (statutFilter === "Tous les statuts") return true; return cand.statut === statutFilter; }).sort((a, b) => { if (sortOrder === "Plus recent") return new Date(b.date) - new Date(a.date); if (sortOrder === "Plus ancien") return new Date(a.date) - new Date(b.date); return 0; });

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures recues</h1>
      <p className="text-gray-600 mb-6">Suivez les reponses des freelances ou entreprises a vos appels d'offres publies.</p>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6"><div className="p-6 border-b border-gray-200"><div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"><div className="relative flex-1 max-w-md"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><RiSearchLine className="text-gray-400" /></div><input type="text" placeholder="Rechercher une candidature..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className="flex space-x-3"><select value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-8"><option>Tous les statuts</option><option>Nouveau</option><option>En evaluation</option><option>Accepte</option><option>Refuse</option></select><select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-8"><option>Trier par date</option><option>Plus recent</option><option>Plus ancien</option></select></div></div></div></div>
      <div className="grid grid-cols-1 gap-4">{filtered.map((cand) => (<div key={cand.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"><div className="flex justify-between items-center mb-2"><div><h2 className="text-lg font-semibold text-gray-800">{cand.nom}</h2><span className="text-sm text-gray-500">{cand.date}</span></div><span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatutStyle(cand.statut)}`}>{cand.statut}</span></div><div className="text-sm text-gray-700 mb-3"><div className="flex items-center gap-2 mb-1"><RiUser3Line className="text-primary" /><span>{cand.freelance}</span></div><div className="flex items-center gap-2"><RiFileTextLine className="text-primary" /><span>{cand.proposition}</span></div></div><div className="flex gap-3 justify-end"><button onClick={() => setActiveSectionWithDest("detail", cand)} className="bg-blue-100 text-blue-700 px-4 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-blue-200 transition"><RiEyeLine />Voir les details</button></div></div>))}</div>
    </div>
  );
};

export default SectionCandidatures;
