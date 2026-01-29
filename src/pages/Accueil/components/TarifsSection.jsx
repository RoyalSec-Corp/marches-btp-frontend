import React from 'react';
import { RiCheckLine } from 'react-icons/ri';

function TarifsSection() {
  return (
    <section id="tarifs" className="py-16 bg-gradient-to-b from-blue-800 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Nos Services Gratuits</h2>
          <p className="text-lg text-white max-w-3xl mx-auto">Tous nos services sont entierement gratuits pour soutenir la communaute BTP.</p>
        </div>
        <div className="bg-gradient-to-b from-blue-700 to-blue-600 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl max-w-3xl mx-auto">
          <div className="p-8">
            <h3 className="text-2xl font-semibold mb-6 text-center text-white">Acces Complet a Tous les Services</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4 text-white">Pour les Entreprises</h4>
                <ul className="space-y-3">
                  {["Creation de contrats illimitee", "Mises en relation illimitees", "Acces aux appels d'offres", "Support 7j/7"].map((item, idx) => (<li key={idx} className="flex items-start"><RiCheckLine className="text-orange-500 w-5 h-5 mt-0.5 mr-2" /><span className="text-white">{item}</span></li>))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4 text-white">Pour les Auto-entrepreneurs</h4>
                <ul className="space-y-3">
                  {["Profil professionnel", "Acces aux offres de mission", "Gestion des contrats", "Facturation simplifiee"].map((item, idx) => (<li key={idx} className="flex items-start"><RiCheckLine className="text-orange-500 w-5 h-5 mt-0.5 mr-2" /><span className="text-white">{item}</span></li>))}
                </ul>
              </div>
            </div>
          </div>
          <div className="px-8 pb-8 text-center"><a href="#" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-button font-medium hover:bg-orange-400 transition whitespace-nowrap">S'inscrire gratuitement</a></div>
        </div>
      </div>
    </section>
  );
}

export default TarifsSection;
