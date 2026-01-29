import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { RiLock2Line, RiArrowLeftLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import authApi from '../../services/authApi';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ReinitialiserMotDePasse = () => {
  const query = useQuery();
  const params = useParams();
  const token = (query.get('token') || params.token || '').trim();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) toast.warning('Lien invalide ou expire. Demandez un nouveau lien depuis Mot de passe oublie.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { toast.error('Lien invalide ou expire.'); return; }
    if (!password || password.length < 8) { toast.error('Le mot de passe doit contenir au moins 8 caracteres.'); return; }
    if (password !== password2) { toast.error('Les mots de passe ne correspondent pas.'); return; }
    try {
      setSubmitting(true);
      await authApi.resetPassword(token, password);
      setDone(true);
      toast.success('Votre mot de passe a ete reinitialise avec succes.');
    } catch (err) {
      const apiMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      toast.error(apiMsg || 'Echec de la reinitialisation du mot de passe.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Reinitialiser le mot de passe</h1>
          <Link to="/connexion" className="text-sm text-blue-600 hover:underline flex items-center"><RiArrowLeftLine className="mr-1" /> Retour</Link>
        </div>
        {!done ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!token && <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">Lien invalide ou expire. Demandez un nouveau lien depuis Mot de passe oublie.</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <div className="relative">
                <RiLock2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" autoComplete="new-password" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} disabled={submitting || !token} required minLength={8} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <RiLock2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" autoComplete="new-password" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="********" value={password2} onChange={(e) => setPassword2(e.target.value)} disabled={submitting || !token} required minLength={8} />
              </div>
            </div>
            <button type="submit" disabled={submitting || !token} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300">{submitting ? 'Reinitialisation...' : 'Reinitialiser'}</button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-gray-700">Votre mot de passe a bien ete reinitialise.</p>
            <Link to="/connexion" className="text-blue-600 hover:underline font-medium inline-flex items-center justify-center"><RiArrowLeftLine className="mr-1" /> Aller a la connexion</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReinitialiserMotDePasse;
