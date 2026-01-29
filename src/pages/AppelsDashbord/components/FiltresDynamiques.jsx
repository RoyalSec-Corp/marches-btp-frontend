import React, { useState } from "react";
import { RiArrowDownSLine, RiCloseLine, RiSearchLine } from "react-icons/ri";

const FiltresDynamiques = () => {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([
    { label: "Développement Web", color: "bg-primary text-white" },
    { label: "Budget > 5 000 €", color: "bg-secondary text-white" },
  ]);

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtres Dynamiques</h3>
          <button className="text-sm text-primary hover:text-blue-600">Réinitialiser</button>
        </div>
        <div className="flex flex-wrap gap-4">
          {/* Statut */}
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Tous les statuts</option>
              <option>Actif</option>
              <option>En cours</option>
              <option>Terminé</option>
              <option>Annulé</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
              <RiArrowDownSLine className="text-gray-400" />
            </div>
          </div>

          {/* Budget */}
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Tous les budgets</option>
              <option>&lt; 1 000 €</option>
              <option>1 000 € - 5 000 €</option>
              <option>5 000 € - 10 000 €</option>
              <option>&gt; 10 000 €</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
              <RiArrowDownSLine className="text-gray-400" />
            </div>
          </div>

          {/* Catégorie */}
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Toutes les catégories</option>
              <option>Gros œuvre</option>
              <option>Second œuvre</option>
              <option>Rénovation</option>
              <option>Génie civil</option>
              <option>VRD</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
              <RiArrowDownSLine className="text-gray-400" />
            </div>
          </div>

          {/* Recherche */}
          <div className="relative flex-1 min-w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un appel d'offre..."
              className="w-full bg-gray-50 border border-gray-200 rounded-button px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <RiSearchLine className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${tag.color}`}
            >
              {tag.label}
              <button
                className="ml-2 w-3 h-3 flex items-center justify-center"
                onClick={() => removeTag(index)}
              >
                <RiCloseLine />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltresDynamiques;