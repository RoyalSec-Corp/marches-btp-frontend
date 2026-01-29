import React from 'react';
import { RiLightbulbLine, RiShieldStarLine, RiCheckLine, RiArrowRightLine } from 'react-icons/ri';

function SolutionsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-800 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-blue-700 to-blue-800 rounded-xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0 border border-orange-400/40"><RiLightbulbLine className="ri-2x text-orange-400" /></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">La Solution pour les Travailleurs Non Declares</h2>
                <p className="text-lg text-white">Devenez auto-entrepreneur pour exercer legalement votre activite</p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-gradient-to-b from-blue-600 to-blue-500 rounded-lg p-6 shadow-md">
                <div className="flex items-start">
                  <RiShieldStarLine className="ri-2x text-orange-400 w-5 h-5 mt-1 mr-2 bg-orange-400/20 rounded-full p-1 border border-orange-400/40" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">La Solution pour Securiser Votre Activite</h3>
                    <div className="space-y-8">
                      <div className="border-b border-gray-200 pb-6">
                        <h4 className="text-lg font-medium text-white mb-4">Pour les Chefs d'Entreprise</h4>
                        <p className="text-white mb-4">En tant que chef d'entreprise, vous risquez de lourdes sanctions en employant des travailleurs non declares. La solution :</p>
                        <ul className="space-y-3 text-white">
                          {["Exigez le statut d'auto-entrepreneur", "Evitez les risques juridiques et financiers", "Beneficiez d'une relation contractuelle claire", "Deduisez de vos impots avec les factures", "Optimisez votre fiscalite en toute legalite"].map((text, index) => (
                            <li key={index} className="flex items-start"><RiCheckLine className="text-orange-500 w-5 h-5 mt-1 mr-2" /><span>{text}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-4">Pour les Travailleurs Non Declares</h4>
                        <p className="text-white mb-4">Pour exercer legalement votre activite, vous devez devenir auto-entrepreneur :</p>
                        <ul className="space-y-3 text-white">
                          {["Travaillez en toute legalite", "Beneficiez d'une protection sociale", "Facturez legalement vos prestations"].map((text, index) => (
                            <li key={index} className="flex items-start"><RiCheckLine className="text-orange-500 w-5 h-5 mt-1 mr-2" /><span>{text}</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">Important : La creation du statut d'auto-entrepreneur est une demarche personnelle que vous devez effectuer vous-meme.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a href="#services" className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-button font-medium hover:bg-orange-600 whitespace-nowrap">Decouvrir tous nos services<RiArrowRightLine className="ml-2" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SolutionsSection;
