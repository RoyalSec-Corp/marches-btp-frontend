import React, { useState, useEffect } from 'react';
import { RiAlertLine, RiEyeLine, RiEyeOffLine, RiCheckLine, RiErrorWarningLine, RiPhoneLine } from 'react-icons/ri';
import { useAuth } from '../../../context/AuthContext';
import authApi from '../../../services/authApi';

function ParametresFreelance({ onOpenLitigeModal }) {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [iban, setIban] = useState('');
  const [originalIban, setOriginalIban] = useState('');
  const [recentLitiges, setRecentLitiges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAccountActive, setIsAccountActive] = useState(true);

  useEffect(() => { loadUserData(); loadRecentLitiges(); }, []);

  const loadUserData = async () => { try { if (user) { setIban(user.iban || 'FR76 1234 5678 9012 3456 7890 123'); setOriginalIban(user.iban || 'FR76 1234 5678 9012 3456 7890 123'); setIsAccountActive(user.is_active !== false); } } catch (error) { console.error('Erreur chargement:', error); } };
  const loadRecentLitiges = async () => { try { const mockLitiges = [{ id: 'LIT-2025-001', contrat: '#CTR-2025-0342', mission: 'Renovation salle de bain', date: '2025-01-22', statut: 'En cours', type: 'Paiement non recu' }]; setRecentLitiges(mockLitiges); } catch (error) { console.error('Erreur chargement litiges:', error); } };

  const handlePasswordChange = async (e) => { e.preventDefault(); if (!currentPassword || !newPassword || !confirmPassword) { setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' }); return; } if (newPassword !== confirmPassword) { setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' }); return; } if (newPassword.length < 6) { setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caracteres' }); return; } setLoading(true); try { await new Promise(resolve => setTimeout(resolve, 1000)); setMessage({ type: 'success', text: 'Mot de passe modifie avec succes' }); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); } catch (error) { setMessage({ type: 'error', text: error.message || 'Erreur lors de la modification du mot de passe' }); } setLoading(false); };
  const handleIbanUpdate = async (e) => { e.preventDefault(); if (!iban.trim()) { setMessage({ type: 'error', text: 'Veuillez saisir un IBAN' }); return; } if (iban === originalIban) { setMessage({ type: 'info', text: 'Aucune modification detectee' }); return; } setLoading(true); try { setOriginalIban(iban); setMessage({ type: 'success', text: 'IBAN mis a jour avec succes' }); } catch (error) { setMessage({ type: 'error', text: 'Erreur lors de la mise a jour de l\'IBAN' }); } setLoading(false); };
  const handleAccountToggle = async () => { setLoading(true); try { setIsAccountActive(!isAccountActive); setMessage({ type: 'success', text: isAccountActive ? 'Compte desactive temporairement' : 'Compte reactive' }); } catch (error) { setMessage({ type: 'error', text: 'Erreur lors de la modification du statut du compte' }); } setLoading(false); };
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR');

  return (
    <div className="max-w-4xl space-y-8">
      {message.text && (<div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}><div className="flex items-center">{message.type === 'success' && <RiCheckLine className="w-5 h-5 mr-2" />}{message.type === 'error' && <RiErrorWarningLine className="w-5 h-5 mr-2" />}<span>{message.text}</span></div></div>)}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Securite</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="relative"><label className="block text-sm font-medium text-white mb-1">Mot de passe actuel</label><div className="relative"><input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" /><button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">{showCurrentPassword ? <RiEyeOffLine /> : <RiEyeLine />}</button></div></div>
          <div className="relative"><label className="block text-sm font-medium text-white mb-1">Nouveau mot de passe</label><div className="relative"><input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" /><button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">{showNewPassword ? <RiEyeOffLine /> : <RiEyeLine />}</button></div></div>
          <div className="relative"><label className="block text-sm font-medium text-white mb-1">Confirmer le mot de passe</label><div className="relative"><input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}</button></div></div>
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-300 transition-all duration-300 whitespace-nowrap text-white px-6 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Modification...' : 'Modifier le mot de passe'}</button>
        </form>
      </div>
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Paiement</h3>
        <form onSubmit={handleIbanUpdate} className="space-y-4">
          <div><label className="block text-sm font-medium text-white mb-1">IBAN (Coordonnees bancaires)</label><input type="text" value={iban} onChange={(e) => setIban(e.target.value.toUpperCase())} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary" placeholder="FR76 1234 5678 9012 3456 7890 123" /><p className="text-xs text-white mt-1">Coordonnees bancaires pour recevoir vos paiements</p></div>
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-300 transition-all duration-300 whitespace-nowrap text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Mise a jour...' : 'Mettre a jour l\'IBAN'}</button>
        </form>
      </div>
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Support & Assistance</h3>
        <div className="mb-6"><button onClick={onOpenLitigeModal} className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red- transition-colors flex items-center justify-center"><RiAlertLine className="mr-2 w-5 h-5" />Signaler un litige</button><p className="text-sm text-white mt-2">Rencontrez-vous un probleme avec un contrat ou un paiement ? Signalez-le ici.</p></div>
        {recentLitiges.length > 0 && (<div className="mb-6"><h4 className="text-md font-medium text-white mb-3">Litiges recents</h4><div className="space-y-3">{recentLitiges.map((litige) => (<div key={litige.id} className="border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"><div className="flex justify-between items-start mb-2"><div className="flex-1"><h5 className="text-sm font-medium text-white">{litige.mission}</h5><p className="text-xs text-white">{litige.contrat} - {litige.type}</p><p className="text-xs text-white">Ouvert le {formatDate(litige.date)}</p></div><span className={`text-xs px-2 py-1 rounded-full font-medium ${litige.statut === 'En cours' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-100 text-green-800'}`}>{litige.statut}</span></div></div>))}</div></div>)}
        <div className="border-t border-gray-100 pt-4"><h4 className="text-md font-medium text-white mb-3">Contact direct</h4><button onClick={() => alert('Redirection vers le support telephonique...')} className="flex items-center text-white hover:text-orange-400 transition-colors"><RiPhoneLine className="mr-2 w-4 h-4" /><span className="text-sm font-medium text-white hover:text-orange-400 transition-colors">Appeler l'assistance: 01 23 45 67 89</span></button></div>
      </div>
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Zone de danger</h3>
        <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-white">{isAccountActive ? 'Desactiver le compte' : 'Reactiver le compte'}</p><p className="text-xs text-white">{isAccountActive ? 'Votre compte sera temporairement desactive' : 'Reactiver votre compte pour recevoir de nouvelles missions'}</p></div><button onClick={handleAccountToggle} disabled={loading} className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${isAccountActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>{loading ? 'Traitement...' : (isAccountActive ? 'Desactiver' : 'Reactiver')}</button></div>
      </div>
    </div>
  );
}

export default ParametresFreelance;
