import React from "react";
import {
  RiAddLine,
  RiMessage3Line,
  RiDownloadLine,
} from "react-icons/ri";

const FloatingMenu = () => {
  return (
    <div className="floating-menu fixed bottom-8 right-8 z-50">
      <div className="flex flex-col space-y-3">
        {/* Bouton ajouter */}
        <button className="w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-all hover:scale-110 flex items-center justify-center">
          <RiAddLine className="text-xl" />
        </button>

        {/* Bouton messages */}
        <button className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110 flex items-center justify-center border border-gray-200 relative">
          <RiMessage3Line className="text-xl" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </button>

        {/* Bouton téléchargement */}
        <button className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110 flex items-center justify-center border border-gray-200">
          <RiDownloadLine className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default FloatingMenu;