import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../services/authApi';

function Connexion() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError("Veuillez saisir votre email et votre mot de passe.");
      return;
    }
    try {
      const { user, accessToken, refreshToken } = await authApi.login(email, password);
      login(user, accessToken);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', accessToken);
      storage.setItem('token', accessToken);
      if (refreshToken) storage.setItem('refreshToken', refreshToken);
      if (user.user_type === 'freelance') navigate('/dashboard-freelance');
      else if (user.user_type === 'entreprise') navigate('/dashboard-entreprise');
      else if (user.user_type === 'ao_individu' || user.user_type === 'ao_societe') navigate('/dashboard-appels');
      else navigate('/');
    } catch (err) {
      setError(err.message || "Echec de la connexion");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-['Pacifico'] text-primary">Marches BTP</Link>
          <Link to="/" className="flex items-center text-gray-600 hover:text-primary"><RiArrowLeftLine className="mr-1" />Retour a l'accueil</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Connexion</h1>
            <p className="text-gray-600">Connectez-vous a votre espace Marches BTP</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm whitespace-pre-line">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" placeholder="Votre adresse email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-12" placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <RiEyeOffLine /> : <RiEyeLine />}</button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer"><input type="checkbox" className="mr-2" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />Se souvenir de moi</label>
              <Link to="/mot-de-passe-oublie" className="text-primary hover:underline">Mot de passe oublie ?</Link>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-button font-medium hover:bg-primary/90 transition-colors">Se connecter</button>
            <div className="text-center"><p className="text-sm text-gray-600">Pas encore de compte ? <Link to="/inscription" className="text-primary hover:underline font-medium">Creer un compte</Link></p></div>
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

export default Connexion;
