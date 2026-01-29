import React from 'react';
import { RiAlertLine, RiCriminalLine, RiMoneyEuroCircleLine, RiArrowRightLine } from 'react-icons/ri';

function RiskAlertSection() {
  return (
    <section className="py-16 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8 border-l-4 border-red-500">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"><RiAlertLine className="text-red-500 text-3xl" /></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Risques majeurs du travail non declare</h2>
                <p className="text-lg text-gray-600">Protegez votre entreprise en evitant les sanctions severes liees au travail non declare</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <RiCriminalLine className="text-red-500 text-2xl mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sanctions penales</h3>
                    <p className="text-gray-700">Jusqu'a <span className="font-semibold">225 000 EUR d'amende</span> et <span className="font-semibold">3 ans de prison</span> pour le chef d'entreprise</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <RiMoneyEuroCircleLine className="text-red-500 text-2xl mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact fiscal</h3>
                    <p className="text-gray-700">Impossibilite de <span className="font-semibold">deduire les charges salariales</span> des travailleurs non declares</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center"><a href="#tarifs" className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-primary/90 whitespace-nowrap">Securisez votre activite<RiArrowRightLine className="ml-2" /></a></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RiskAlertSection;
