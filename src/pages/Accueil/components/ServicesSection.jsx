import React from 'react';
import { RiFileTextLine, RiTeamLine, RiAuctionLine, RiArrowRightLine } from 'react-icons/ri';

function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Decouvrez comment Marches BTP peut vous aider a optimiser votre activite et a developper votre entreprise.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mb-6 border border-orange-400/40"><RiFileTextLine className="ri-2x text-orange-400" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Creation de Contrats</h3>
            <p className="text-gray-600 mb-6">Generez des contrats conformes avec des auto-entrepreneurs en quelques clics.</p>
            <a href="#" className="text-primary font-medium flex items-center hover:underline">En savoir plus <RiArrowRightLine className="ml-1" /></a>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mb-6 border border-orange-400/40"><RiTeamLine className="ri-2x text-orange-400" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Mise en Relation</h3>
            <p className="text-gray-600 mb-6">Trouvez rapidement des professionnels qualifies pour vos chantiers.</p>
            <a href="#" className="text-primary font-medium flex items-center hover:underline">En savoir plus <RiArrowRightLine className="ml-1" /></a>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mb-6 border border-orange-400/40"><RiAuctionLine className="ri-2x text-orange-400" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Appels d'Offres</h3>
            <p className="text-gray-600 mb-6">Accedez a des opportunites commerciales publiques et privees.</p>
            <a href="#" className="text-primary font-medium flex items-center hover:underline">En savoir plus <RiArrowRightLine className="ml-1" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
