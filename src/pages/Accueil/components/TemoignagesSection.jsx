import React from 'react';

function TemoignagesSection() {
  const temoignages = [
    { name: 'Jean-Michel Dupont', role: 'Directeur, Constructions Mediterranee', text: 'Marches BTP a completement transforme notre facon de gerer les contrats avec les auto-entrepreneurs. Nous gagnons un temps precieux et avons considerablement reduit nos risques juridiques.' },
    { name: 'Sophie Leroy', role: 'Electricienne independante', text: 'En tant qu\'auto-entrepreneur, la plateforme m\'a permis de trouver rapidement des missions et de developper mon reseau professionnel. Les contrats sont clairs et je suis payee dans les delais.' },
    { name: 'Francois Moreau', role: 'Gerant, Moreau Construction', text: 'Grace aux appels d\'offres disponibles sur Marches BTP, nous avons pu diversifier notre activite et remporter des contrats auxquels nous n\'aurions pas eu acces autrement.' }
  ];

  return (
    <section id="temoignages" className="py-16 bg-gradient-to-b from-blue-800 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ce que disent nos clients</h2>
          <p className="text-lg text-white max-w-3xl mx-auto">Decouvrez les experiences de professionnels du BTP qui utilisent notre plateforme au quotidien.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {temoignages.map((t, idx) => (
            <div key={idx} className="testimonial-card bg-gradient-to-b from-blue-700 to-blue-600 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6"><div className="w-5 h-5 flex items-center justify-center text-orange-500"><i className="ri-double-quotes-l ri-lg"></i></div></div>
              <p className="text-white mb-6">"{t.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-gray-600 font-bold">{t.name.charAt(0)}</div>
                <div><h4 className="text-white font-medium">{t.name}</h4><p className="text-white text-sm">{t.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TemoignagesSection;
