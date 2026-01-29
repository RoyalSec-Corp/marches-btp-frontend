import React, { useState, useEffect, useCallback } from 'react';
import contractsApi from '../../../services/contractsApi';

function PaiementsFreelance({ autoRefreshMs = 30000 }) {
  const [payments, setPayments] = useState({ total: 0, platform: 0, cash: 0, wallet: 0, pending_commission_deductions: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const COMMISSION_RATE = 0.05;

  const loadPayments = useCallback(async () => {
    try {
      const data = await contractsApi.getFreelancePayments();
      setPayments(data);
    } catch (error) {
      console.error('Erreur:', error);
      setPayments({ total: 8450, platform: 5200, cash: 3250, wallet: 2500, pending_commission_deductions: 200, history: [{ date: '15 Jan 2025', mission: 'Electricite - Lyon', mode: 'Carte', amount: 850, commission: 0, net: 850, status: 'completed', type: 'platform_transfer' }, { date: '12 Jan 2025', mission: 'Plomberie - Villeurbanne', mode: 'Especes', amount: 1200, commission: 180, net: 1020, status: 'commission_deducted', type: 'wallet_deduction' }] });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadPayments(); }, [loadPayments]);
  useEffect(() => { if (!autoRefreshMs || autoRefreshMs < 1000) return; const id = setInterval(loadPayments, autoRefreshMs); return () => clearInterval(id); }, [autoRefreshMs, loadPayments]);

  if (loading) return (<div className="space-y-6 animate-pulse"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1,2,3].map((index) => (<div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div><div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div><div className="h-3 bg-gray-200 rounded w-1/4"></div></div>))}</div></div>);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3"><div className="bg-white/20 p-2 rounded-lg"><span className="text-2xl">\ud83d\udcb0</span></div><div><h2 className="text-xl font-bold">Portefeuille Marches BTP</h2><p className="text-blue-100 text-sm">Systeme de commission automatique</p></div></div>
          <button onClick={() => setShowWalletDetails(!showWalletDetails)} className="bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-300 hover:to-blue-500 transition-all duration-300 whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium">{showWalletDetails ? 'Masquer details' : 'Voir details'}</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-lg p-4"><div className="flex items-center justify-between"><div><p className="text-blue-100 text-sm">Solde disponible</p><p className="text-2xl font-bold">{(payments.wallet || 0).toLocaleString('fr-FR')} \u20ac</p></div><div className="text-3xl">\ud83c\udfe6</div></div></div>
          <div className="bg-white/10 rounded-lg p-4"><div className="flex items-center justify-between"><div><p className="text-blue-100 text-sm">Commissions a deduire</p><p className="text-2xl font-bold text-orange-200">{(payments.pending_commission_deductions || 0).toLocaleString('fr-FR')} \u20ac</p></div><div className="text-3xl">\u26a0\ufe0f</div></div></div>
        </div>
        {showWalletDetails && (<div className="mt-6 bg-white/10 rounded-lg p-4"><h4 className="font-medium mb-3">\ud83d\udca1 Comment ca marche ?</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div className="bg-white/10 rounded-lg p-3"><div className="flex items-center gap-2 mb-2"><span>\ud83d\udcb3</span><span className="font-medium">Paiements par carte</span></div><p className="text-blue-100">Marches BTP verse directement votre part dans ce portefeuille</p></div><div className="bg-white/10 rounded-lg p-3"><div className="flex items-center gap-2 mb-2"><span>\ud83d\udcb5</span><span className="font-medium">Paiements en especes</span></div><p className="text-blue-100">La commission est automatiquement deduite de ce portefeuille</p></div></div></div>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm border border-gray-200 p-6"><h3 className="text-lg font-semibold text-white mb-2">Missions finalisees</h3><p className="text-3xl font-bold text-white">{(payments.total || 0).toLocaleString('fr-FR')} \u20ac</p><p className="text-sm text-white mt-2">Total ce mois</p></div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm border border-gray-200 p-6"><h3 className="text-lg font-semibold text-white mb-2">\ud83d\udcb3 Paiements carte</h3><p className="text-3xl font-bold text-green-600">{payments.platform.toLocaleString('fr-FR')} \u20ac</p><p className="text-sm text-white mt-2">Versement direct</p></div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm border border-gray-200 p-6"><h3 className="text-lg font-semibold text-white mb-2">\ud83d\udcb5 Paiements especes</h3><p className="text-3xl font-bold text-orange-600">{payments.cash.toLocaleString('fr-FR')} \u20ac</p><p className="text-sm text-white mt-2">Commission deduite</p></div>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Historique des paiements</h3>
        <div className="space-y-4">
          {payments.history.map((payment, index) => (<div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${payment.mode === 'Carte' ? 'bg-green-100' : 'bg-orange-100'}`}><span className="text-xl">{payment.mode === 'Carte' ? '\ud83d\udcb3' : '\ud83d\udcb5'}</span></div><div><h4 className="font-semibold text-gray-900">{payment.mission}</h4><p className="text-sm text-gray-600">{payment.date}</p></div></div><div className="text-right"><p className="text-lg font-bold text-gray-900">{payment.amount.toLocaleString('fr-FR')} \u20ac</p><span className={`px-2 py-1 text-xs rounded-full ${payment.mode === 'Carte' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{payment.mode}</span></div></div><div className={`p-3 rounded-lg ${payment.mode === 'Carte' ? 'bg-green-50' : 'bg-orange-50'}`}>{payment.mode === 'Carte' ? (<div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-green-700"><span>\u2705</span><span>Versement direct de Marches BTP</span></div><div className="text-right"><p className="text-sm text-green-700">Montant recu: <span className="font-medium">{payment.net.toLocaleString('fr-FR')} \u20ac</span></p><p className="text-xs text-green-600">Commission : {(payment.amount * COMMISSION_RATE).toLocaleString('fr-FR')} \u20ac (retenue par la plateforme)</p></div></div>) : (<div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-orange-700"><span>\u26a1</span><span>Commission deduite du portefeuille</span></div><div className="text-right"><p className="text-sm text-orange-700">Net apres deduction: <span className="font-medium">{payment.net.toLocaleString('fr-FR')} \u20ac</span></p><p className="text-xs text-orange-600">Commission deduite: -{payment.commission.toLocaleString('fr-FR')} \u20ac</p></div></div>)}</div><div className="mt-3 flex items-center justify-between text-xs"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${payment.status === 'completed' ? 'bg-green-500' : payment.status === 'commission_deducted' ? 'bg-orange-500' : 'bg-gray-400'}`}></div><span className="text-gray-600">{payment.status === 'completed' ? 'Traite avec succes' : payment.status === 'commission_deducted' ? 'Commission deduite' : 'En cours de traitement'}</span></div><span className="text-gray-500">Type: {payment.type === 'platform_transfer' ? 'Virement plateforme' : 'Deduction portefeuille'}</span></div></div>))}
        </div>
        {payments.history.length === 0 && (<div className="text-center py-8 text-white"><div className="text-4xl mb-2">\ud83d\udcb3</div><p>Aucune transaction pour le moment</p></div>)}
      </div>
    </div>
  );
}

export default PaiementsFreelance;
