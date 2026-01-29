import React from 'react';

function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-700 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Restez informe</h2>
          <p className="text-lg text-white mb-8">Inscrivez-vous a notre newsletter pour recevoir nos actualites, conseils et offres speciales.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input type="email" placeholder="Votre adresse email" className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <button className="bg-orange-500 text-white px-6 py-3 rounded-button font-medium hover:bg-orange-600 whitespace-nowrap">S'inscrire</button>
          </div>
          <div className="mt-4 flex items-center justify-center cursor-pointer">
            <div id="newsletter-consent" className="custom-checkbox" onClick={(e) => e.currentTarget.classList.toggle('checked')}></div>
            <label htmlFor="newsletter-consent" className="ml-2 text-sm text-white cursor-pointer">J'accepte de recevoir des informations commerciales de Marches BTP</label>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
