import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="hero-section py-20 md:py-24 relative bg-blue-800">
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('/images/hero.jpg')" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-700/60 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">La solution innovante pour les professionnels du BTP</h1>
          <p className="text-lg text-white mb-8">Simplifiez vos demarches administratives, trouvez des partenaires qualifies et accedez a de nouvelles opportunites commerciales en quelques clics.</p>
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <Link to="/inscription-entreprise" className="bg-orange-500 text-white px-6 py-3 rounded-button font-medium hover:bg-orange-600 transition-colors">Entreprise BTP</Link>
            <Link to="/inscription-freelance" className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white px-6 py-3 rounded-button font-medium shadow-md hover:from-blue-800 hover:via-blue-600 hover:to-blue-500 transition-all">Auto-entrepreneur BTP</Link>
            <Link to="/inscription-appel-offre" className="bg-transparent text-white border border-white px-6 py-3 rounded-button font-medium hover:bg-white hover:text-blue-700 transition-colors">Publier un appel d'offres</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
