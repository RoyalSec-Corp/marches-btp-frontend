import React from 'react';
import { RiShieldCheckLine, RiFileTextLine, RiTeamLine, RiAuctionLine, RiCheckLine, RiCustomerService2Line } from 'react-icons/ri';

function SidebarInfosEntreprise() {
  return (
    <aside className="bg-white rounded-xl shadow-md p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Avantages pour les entreprises BTP</h2>
        <div className="space-y-6">
          <div className="flex items-start"><RiShieldCheckLine className="text-primary text-xl mr-3 mt-1" /><div><h3 className="text-lg font-semibold text-gray-900 mb-1">Conformite legale garantie</h3><p className="text-gray-600 text-sm">Evitez les risques juridiques lies au travail non declare. Tous nos contrats sont conformes a la legislation en vigueur.</p></div></div>
          <div className="flex items-start"><RiFileTextLine className="text-primary text-xl mr-3 mt-1" /><div><h3 className="text-lg font-semibold text-gray-900 mb-1">Gestion administrative simplifiee</h3><p className="text-gray-600 text-sm">Generez des contrats en quelques clics et reduisez considerablement votre charge administrative.</p></div></div>
          <div className="flex items-start"><RiTeamLine className="text-primary text-xl mr-3 mt-1" /><div><h3 className="text-lg font-semibold text-gray-900 mb-1">Acces a un reseau qualifie</h3><p className="text-gray-600 text-sm">Trouvez rapidement des auto-entrepreneurs qualifies pour vos chantiers et projets.</p></div></div>
          <div className="flex items-start"><RiAuctionLine className="text-primary text-xl mr-3 mt-1" /><div><h3 className="text-lg font-semibold text-gray-900 mb-1">Opportunites commerciales</h3><p className="text-gray-600 text-sm">Accedez a des appels d'offres publics et prives adaptes a votre secteur d'activite.</p></div></div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Securisation des relations</h2>
        <ul className="space-y-4 text-sm text-gray-600">
          <li className="flex items-start"><RiCheckLine className="text-primary text-base mr-2 mt-1" />Verification du statut legal des auto-entrepreneurs</li>
          <li className="flex items-start"><RiCheckLine className="text-primary text-base mr-2 mt-1" />Contrats juridiquement securises</li>
          <li className="flex items-start"><RiCheckLine className="text-primary text-base mr-2 mt-1" />Facturation et suivi des paiements facilites</li>
          <li className="flex items-start"><RiCheckLine className="text-primary text-base mr-2 mt-1" />Historique complet des collaborations</li>
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Support client</h2>
        <div className="flex items-start"><RiCustomerService2Line className="text-primary text-xl mr-3 mt-1" /><p className="text-gray-600 text-sm">Notre equipe est disponible 5j/7 pour repondre a toutes vos questions ou problemes techniques.</p></div>
      </div>
    </aside>
  );
}

export default SidebarInfosEntreprise;
