import React from 'react';
import { RiShieldCheckLine, RiFileList3Line, RiTimeLine, RiLineChartLine } from 'react-icons/ri';

function AvantagesSection() {
  const avantages = [
    { icon: <RiShieldCheckLine className="ri-2x text-orange-400" />, title: 'Conformite Legale', description: 'Securisez votre activite en respectant la reglementation et evitez les risques lies au travail non declare.' },
    { icon: <RiFileList3Line className="ri-2x text-orange-400" />, title: 'Simplicite Administrative', description: 'Reduisez votre charge administrative grace a nos outils intuitifs et gagnez un temps precieux.' },
    { icon: <RiTimeLine className="ri-2x text-orange-400" />, title: 'Reactivite', description: 'Trouvez rapidement des professionnels disponibles pour repondre aux urgences et assurer la continuite de vos chantiers.' },
    { icon: <RiLineChartLine className="ri-2x text-orange-400" />, title: 'Opportunites Commerciales', description: "Developpez votre activite en accedant a de nouveaux marches et appels d'offres adaptes a votre expertise." }
  ];

  return (
    <section id="avantages" className="py-16 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Pourquoi Choisir Marches BTP ?</h2>
          <p className="text-lg text-white max-w-3xl mx-auto">Notre plateforme a ete concue pour repondre aux defis specifiques du secteur du BTP.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {avantages.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-400/40">
                <div className="w-8 h-8 flex items-center justify-center">{item.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-white">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AvantagesSection;
