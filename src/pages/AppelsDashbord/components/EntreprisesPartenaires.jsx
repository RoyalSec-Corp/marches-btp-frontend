import React from "react";
import {
  RiStarFill,
  RiBuildingLine,
  RiPaletteLine,
  RiMegaphoneLine,
} from "react-icons/ri";

const EntreprisesPartenaires = () => {
  const entreprises = [
    {
      nom: "Construction Plus",
      activite: "Entreprise générale de bâtiment",
      note: 4.9,
      projets: 45,
      icon: <RiBuildingLine className="text-primary text-xl" />,
      bg: "bg-blue-100",
    },
    {
      nom: "BTP Solutions",
      activite: "Spécialiste gros œuvre",
      note: 4.8,
      projets: 32,
      icon: <RiPaletteLine className="text-purple-500 text-xl" />,
      bg: "bg-purple-100",
    },
    {
      nom: "Génie Civil Expert",
      activite: "Travaux publics et ouvrages d'art",
      note: 4.7,
      projets: 67,
      icon: <RiMegaphoneLine className="text-secondary text-xl" />,
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Entreprises Partenaires</h3>
          <button className="text-sm text-primary hover:text-blue-600">Voir tout</button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {entreprises.map((e, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${e.bg} rounded-xl flex items-center justify-center`}>
                  {e.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{e.nom}</h4>
                  <p className="text-sm text-gray-500">{e.activite}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 flex items-center justify-center text-yellow-400">
                        <RiStarFill className="text-xs" />
                      </div>
                      <span className="text-sm text-gray-600">{e.note}</span>
                    </div>
                    <span className="text-sm text-gray-400 ml-2">• {e.projets} projets</span>
                  </div>
                </div>
              </div>
              <button className="bg-secondary text-white px-4 py-2 rounded-button text-sm hover:bg-green-600 transition-colors whitespace-nowrap">
                Contacter
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntreprisesPartenaires;