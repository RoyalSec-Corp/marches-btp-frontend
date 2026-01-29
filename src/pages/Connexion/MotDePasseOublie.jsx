import React, { useState } from 'react';
import { RiMailLine, RiArrowLeftLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authApi from '../../services/authApi';

const MotDePasseOublie = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Veuillez saisir votre adresse email.'); return; }
    try {
      setSubmitting(true);
      await authApi.requestPasswordReset(email.trim());
      setDone(true);
      toast.success('Si un compte existe pour cet email, un lien de reinitialisation a ete envoye.');
    } catch (err) {
      setDone(true);
      toast.info('Si un compte existe pour cet email, un lien de reinitialisation a ete envoye.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Mot de passe oublie</h1>
          <Link to="/connexion" className="text-sm text-blue-600 hover:underline flex items-center"><RiArrowLeftLine className="mr-1" /> Retour</Link>
        </div>
        {!done ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">Saisissez votre adresse email. Nous vous enverrons un lien pour reinitialiser votre mot de passe.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={submitting} required />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300">{submitting ? 'Envoi...' : 'Envoyer le lien de reinitialisation'}</button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">Si un compte est associe a <span className="font-medium">{email}</span>, vous recevrez un email avec les instructions pour reinitialiser votre mot de passe.</p>
            <p className="text-sm text-gray-500">Pensez a verifier vos spams/courriers indesirables.</p>
            <div className="pt-2"><Link to="/connexion" className="text-blue-600 hover:underline">Revenir a la page de connexion</Link></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotDePasseOublie;
