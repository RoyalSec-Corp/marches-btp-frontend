import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Inscription() {
  const [selectedProfile, setSelectedProfile] = useState('entreprise');
  const navigate = useNavigate();

  const handleSelect = (profile) => { setSelectedProfile(profile); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProfile === 'auto') navigate('/inscription-freelance');
    else if (selectedProfile === 'entreprise') navigate('/inscription-entreprise');
    else if (selectedProfile === 'appels') navigate('/inscription-appel-offre');
    else alert("Veuillez selectionner un type de profil.");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-['Pacifico'] text-primary">Marches BTP</Link>
          <Link to="/" className="flex items-center text-gray-600 hover:text-primary"><i className="ri-arrow-left-line mr-1"></i>Retour a l'accueil</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Creer votre compte</h1>
            <p className="text-gray-600">Rejoignez Marches BTP et accedez a tous nos services dedies aux professionnels du batiment</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Type de profil</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'entreprise', label: 'Entreprise BTP', description: 'Pour les entreprises du batiment souhaitant trouver des partenaires et gerer leurs contrats' },
                  { id: 'auto', label: 'Auto-entrepreneur', description: 'Pour les independants proposant leurs services aux entreprises du batiment' },
                  { id: 'appels', label: "Appels d'offres", description: "Pour toute personne physique ou morale souhaitant publier des appels d'offres" },
                ].map((profile) => (
                  <div key={profile.id} className={`border rounded-lg p-4 cursor-pointer hover:border-primary ${selectedProfile === profile.id ? 'border-primary' : 'border-gray-200'}`} onClick={() => handleSelect(profile.id)}>
                    <div className="flex items-center mb-3">
                      <span className={`custom-radio ${selectedProfile === profile.id ? 'checked' : ''}`}></span>
                      <span className="ml-3 font-medium text-gray-900">{profile.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 pl-8">{profile.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div><button type="submit" className="w-full bg-primary text-white py-3 rounded-button font-medium hover:bg-primary/90 transition-colors">Continuer</button></div>
          </form>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Les champs marques d'un <span className="text-red-500">*</span> sont obligatoires</p>
          <p className="mt-2">En cas de difficulte, contactez notre service client au <a href="tel:+33123456789" className="text-primary hover:underline">01 23 45 67 89</a></p>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">2025 Marches BTP. Tous droits reserves.</p>
          <div className="flex justify-center mt-4 space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Mentions legales</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Politique de confidentialite</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Conditions generales</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Inscription;
