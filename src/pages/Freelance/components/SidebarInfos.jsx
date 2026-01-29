import React from 'react';
import { RiMoneyEuroCircleLine, RiFileTextLine, RiShieldCheckLine, RiMapPinLine } from 'react-icons/ri';

function SidebarInfos() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pourquoi nous rejoindre ?</h3>
      <div className="space-y-4">
        <div className="flex items-start"><div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3"><RiMoneyEuroCircleLine className="text-green-600" /></div><div><h4 className="font-medium text-gray-900 text-sm">Zero frais d'inscription</h4><p className="text-xs text-gray-600">Creez votre compte gratuitement et sans engagement</p></div></div>
        <div className="flex items-start"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3"><RiFileTextLine className="text-blue-600" /></div><div><h4 className="font-medium text-gray-900 text-sm">Generez vos contrats facilement</h4><p className="text-xs text-gray-600">Outils integres pour creer des devis et contrats professionnels</p></div></div>
        <div className="flex items-start"><div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3"><RiShieldCheckLine className="text-purple-600" /></div><div><h4 className="font-medium text-gray-900 text-sm">Paiement securise</h4><p className="text-xs text-gray-600">Transactions protegees et paiements garantis</p></div></div>
        <div className="flex items-start"><div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3"><RiMapPinLine className="text-orange-600" /></div><div><h4 className="font-medium text-gray-900 text-sm">Acces rapide aux missions proches</h4><p className="text-xs text-gray-600">Trouvez des missions dans votre secteur geographique</p></div></div>
      </div>
    </div>
  );
}

export default SidebarInfos;
