import React from 'react';
import { RiSearchLine } from 'react-icons/ri';

function FreelanceSearch() {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-white mb-4">Rechercher un Auto-entrepreneur</h2>
      <div className="flex items-center space-x-3">
        <input type="text" placeholder="Nom, competence, region..." className="form-input flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-primary" />
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"><RiSearchLine className="w-5 h-5" /></button>
      </div>
    </div>
  );
}

export default FreelanceSearch;
