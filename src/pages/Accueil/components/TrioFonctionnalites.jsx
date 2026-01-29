import React from 'react';
import { RiFileList3Line, RiUserSearchLine, RiShakeHandsLine } from 'react-icons/ri';

function TrioFonctionnalites() {
  const features = [
    { icon: <RiFileList3Line className="ri-2x text-orange-400" />, title: 'Generer des contrats en quelques clics' },
    { icon: <RiShakeHandsLine className="ri-2x text-orange-400" />, title: 'Recruter des salaries' },
    { icon: <RiUserSearchLine className="ri-2x text-orange-400" />, title: 'Trouver des clients' },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-4xl mx-auto px-6 text-center relative mb-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-16 sm:mb-52 md:mb-52 mt-6 sm:mt-4 md:mt-0">Les 3 Super-Pouvoirs de Marches BTP</h2>
        <div className="relative w-60 h-60 mx-auto hidden sm:block">
          <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', background: 'linear-gradient(135deg, #1e3a8a, #2563eb, #1e40af)', opacity: 0.9 }} />
          <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-orange-400/20 rounded-full mx-auto mb-2 shadow-lg border border-orange-400/40">{features[0].icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 w-48 md:w-56 mx-auto">{features[0].title}</h3>
          </div>
          <div className="absolute bottom-0 -left-40 transform translate-y-20 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-orange-400/20 rounded-full mx-auto mb-2 shadow-lg border border-orange-400/40">{features[1].icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 w-48 mx-auto">{features[1].title}</h3>
          </div>
          <div className="absolute bottom-0 -right-40 transform translate-y-20 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-orange-400/20 rounded-full mx-auto mb-2 shadow-lg border border-orange-400/40">{features[2].icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 w-48 mx-auto">{features[2].title}</h3>
          </div>
        </div>
        <div className="flex flex-col items-center gap-10 sm:hidden mt-10">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-orange-400/20 rounded-full mx-auto mb-2 shadow-lg border border-orange-400/40">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 max-w-xs">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrioFonctionnalites;
