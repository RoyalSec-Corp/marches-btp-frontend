import React from 'react';
import { Link } from 'react-router-dom';
import { RiBuilding2Line, RiFileList3Line } from 'react-icons/ri';

function CtaSection() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 flex flex-col h-full">
            <div className="mb-8 flex-1">
              <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mb-6 border border-orange-400/40"><RiBuilding2Line className="ri-2x text-orange-400" /></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Vous etes une entreprise du BTP ?</h2>
              <p className="text-gray-600 mb-6">Rejoignez les nombreuses entreprises qui ont deja optimise leur gestion administrative et developpe leur reseau professionnel grace a Marches BTP.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/inscription-entreprise" className="bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-primary/90 text-center whitespace-nowrap">Entreprise BTP</Link>
                <Link to="/inscription-freelance" className="bg-white text-primary border border-primary px-6 py-3 rounded-button font-medium hover:bg-gray-50 text-center whitespace-nowrap">Auto-entrepreneur BTP</Link>
              </div>
            </div>
            <img src="/images/btp.jpg" alt="Professionnel du BTP" className="rounded-lg w-full h-64 object-cover shadow-md mt-auto" />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 flex flex-col h-full">
            <div className="mb-8 flex-1">
              <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mb-6 border border-orange-400/40"><RiFileList3Line className="ri-2x text-orange-400" /></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Vous avez un projet a realiser ?</h2>
              <p className="text-gray-600 mb-6">Publiez gratuitement votre appel d'offres et trouvez les meilleurs professionnels qualifies pour votre projet de construction ou renovation.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/inscription-appel-offre" className="bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-primary/90 text-center whitespace-nowrap">Publier un appel d'offres</Link>
                <Link to="#" className="bg-white text-primary border border-primary px-6 py-3 rounded-button font-medium hover:bg-gray-50 text-center whitespace-nowrap">Comment ca marche ?</Link>
              </div>
            </div>
            <img src="/images/appel-offre.jpg" alt="Appel d'offres" className="rounded-lg w-full h-64 object-cover shadow-md mt-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
