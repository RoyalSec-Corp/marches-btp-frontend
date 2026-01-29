import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../services/authApi';

function ConnexionAdmin() {
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
    if (!email || !password) { setError("Veuillez saisir votre email et votre mot de passe."); return; }
    try {
      const response = await authApi.login(email, password);
      const { user, accessToken, refreshToken } = response;
      login(user, accessToken);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', accessToken);
      storage.setItem('token', accessToken);
      if (refreshToken) storage.setItem('refreshToken', refreshToken);
      navigate('/dashboard-admin');
    } catch (err) {
      setError(err.message || "Echec de la connexion. Verifiez vos identifiants.");
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
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Connexion Admin</h1>
            <p className="text-gray-600">Connectez-vous a votre espace Admin Marches BTP</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-12 focus:ring-primary focus:border-primary" placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <RiEyeOffLine /> : <RiEyeLine />}</button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer text-gray-600"><input type="checkbox" className="mr-2 rounded text-primary focus:ring-primary" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />Se souvenir de moi</label>
              <Link to="/reset-password" className="text-primary hover:underline">Mot de passe oublie ?</Link>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-button font-medium hover:bg-primary/90 transition-colors shadow-md">Acceder au Tableau de Bord</button>
            <div className="text-center pt-2"><p className="text-sm text-gray-600">Pas encore de compte ? <Link to="/inscription" className="text-primary hover:underline font-medium">Creer un compte</Link></p></div>
          </form>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Les champs marques d'un <span className="text-red-500">*</span> sont obligatoires</p>
          <p className="mt-2">En cas de difficulte, contactez le support technique.</p>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">2025 Marches BTP. Tous droits reserves.</p>
          <div className="flex justify-center mt-4 space-x-6">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">Mentions legales</Link>
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">Politique de confidentialite</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ConnexionAdmin;
