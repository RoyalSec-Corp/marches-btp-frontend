import React, { useState, useEffect, useMemo } from 'react';
import { RiArrowLeftLine } from 'react-icons/ri';

function Step5Finalisation({ formData, setFormData, prevStep }) {
  const joursOptions = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  const [errors, setErrors] = useState({});
  const [acceptedCGU, setAcceptedCGU] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const countryRawMax = (raw) => { const cc = raw.slice(0, 2).toUpperCase(); if (cc === 'FR') return 27; return 34; };
  const sanitizeIBAN = (v) => v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const formatIBAN = (raw) => raw.replace(/(.{4})/g, '$1 ').trim();

  const validateIBAN = (ibanRaw) => {
    const iban = sanitizeIBAN(ibanRaw);
    const regex = /^([A-Z]{2}\d{2}[A-Z0-9]{1,30})$/;
    if (!regex.test(iban)) return false;
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    const converted = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
    let remainder = 0;
    for (let i = 0; i < converted.length; i += 7) { const block = String(remainder) + converted.substr(i, 7); remainder = parseInt(block, 10) % 97; }
    return remainder === 1;
  };

  const toggleJour = (jour) => { setFormData((prev) => ({ ...prev, jours: prev.jours.includes(jour) ? prev.jours.filter((j) => j !== jour) : [...prev.jours, jour] })); };

  const validateField = (name, value) => {
    let message = '';
    switch (name) {
      case 'iban': if (!value.trim()) message = 'L\'IBAN est obligatoire.'; else if (!validateIBAN(value)) message = 'IBAN invalide.'; break;
      case 'titulaireCompte': if (!value.trim()) message = 'Le nom du titulaire est obligatoire.'; else if (value.trim().length < 2) message = 'Nom trop court.'; break;
      default: break;
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  useEffect(() => { validateField('iban', formData.iban || ''); validateField('titulaireCompte', formData.titulaireCompte || ''); }, [formData.iban, formData.titulaireCompte]);

  const blockingReasons = useMemo(() => {
    const reasons = [];
    if (!formData.iban?.trim()) reasons.push('Renseignez votre IBAN.');
    else if (errors.iban) reasons.push(errors.iban);
    if (!formData.titulaireCompte?.trim()) reasons.push('Indiquez le nom du titulaire du compte.');
    else if (errors.titulaireCompte) reasons.push(errors.titulaireCompte);
    if (!acceptedCGU) reasons.push('Vous devez accepter les conditions generales d\'utilisation.');
    if (!acceptedPrivacy) reasons.push('Vous devez accepter la politique de confidentialite.');
    return reasons;
  }, [formData.iban, formData.titulaireCompte, acceptedCGU, acceptedPrivacy, errors]);

  const isValid = blockingReasons.length === 0;

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Finalisation</h2>
      <div className="mb-6"><h3 className="text-lg font-medium text-gray-900 mb-2">Vos disponibilites <span className="text-gray-400 text-sm">(optionnel)</span></h3><p className="text-sm text-gray-500 mb-3">Selectionnez vos jours de preference.</p><div className="flex flex-wrap gap-3 mb-2">{joursOptions.map((jour) => (<label key={jour} className="flex items-center gap-2 text-sm capitalize"><input type="checkbox" className="custom-checkbox" checked={formData.jours.includes(jour)} onChange={() => toggleJour(jour)} />{jour}</label>))}</div></div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Heure de debut <span className="text-gray-400 text-xs">(optionnel)</span></label><select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" value={formData.heureDebut || ''} onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}><option value="">-</option>{['06:00', '07:00', '08:00', '09:00', '10:00'].map((heure) => (<option key={heure} value={heure}>{heure}</option>))}</select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Heure de fin <span className="text-gray-400 text-xs">(optionnel)</span></label><select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" value={formData.heureFin || ''} onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}><option value="">-</option>{['16:00', '17:00', '18:00', '19:00', '20:00'].map((heure) => (<option key={heure} value={heure}>{heure}</option>))}</select></div>
      </div>
      <div className="mb-6"><h3 className="text-lg font-medium text-gray-900 mb-4">Compte bancaire *</h3><input type="text" inputMode="text" autoComplete="off" spellCheck={false} placeholder="IBAN (ex : FR76 3000 6000 ...)" className={`w-full mb-1 px-4 py-3 border rounded-lg text-sm ${errors.iban ? 'border-red-500' : 'border-gray-300'}`} value={formData.iban || ''} onChange={(e) => { const cleaned = sanitizeIBAN(e.target.value); const max = countryRawMax(cleaned); const limitedRaw = cleaned.slice(0, max); const formatted = formatIBAN(limitedRaw); setFormData({ ...formData, iban: formatted }); validateField('iban', formatted); }} onKeyDown={(e) => { const allowed = /[a-zA-Z0-9 ]/.test(e.key) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key); if (!allowed) e.preventDefault(); }} /><p className="text-xs text-gray-500 mb-3">{(() => { const raw = sanitizeIBAN(formData.iban || ''); const max = countryRawMax(raw); const cc = raw.slice(0, 2) || '-'; return `Pays detecte : ${cc} - ${raw.length}/${max} caracteres`; })()}</p>{errors.iban && <p className="text-red-500 text-xs mb-3">{errors.iban}</p>}<input type="text" placeholder="Nom du titulaire du compte" className={`w-full px-4 py-3 border rounded-lg text-sm ${errors.titulaireCompte ? 'border-red-500' : 'border-gray-300'}`} value={formData.titulaireCompte || ''} onChange={(e) => { setFormData({ ...formData, titulaireCompte: e.target.value }); validateField('titulaireCompte', e.target.value); }} />{errors.titulaireCompte && <p className="text-red-500 text-xs">{errors.titulaireCompte}</p>}</div>
      <div className="mb-6 space-y-2 text-sm"><label className="flex items-start gap-2"><input type="checkbox" className="custom-checkbox" checked={acceptedCGU} onChange={(e) => setAcceptedCGU(e.target.checked)} />J'accepte les <span className="text-primary cursor-pointer">conditions generales d'utilisation</span> *</label><label className="flex items-start gap-2"><input type="checkbox" className="custom-checkbox" checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} />J'accepte la <span className="text-primary cursor-pointer">politique de confidentialite</span> *</label><label className="flex items-start gap-2"><input type="checkbox" className="custom-checkbox" />Je souhaite recevoir les newsletters et offres promotionnelles.</label></div>
      {!isValid && <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800"><p className="font-medium mb-1">A corriger avant de creer votre compte :</p><ul className="list-disc ml-5 space-y-1">{blockingReasons.map((r, i) => (<li key={i}>{r}</li>))}</ul></div>}
      <div className="flex justify-between"><button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-button flex items-center gap-2"><RiArrowLeftLine /> Precedent</button><button type="submit" className={`px-8 py-3 rounded-button font-medium text-white ${isValid ? 'bg-primary' : 'bg-gray-400 cursor-not-allowed'}`} disabled={!isValid}>Creer mon compte</button></div>
    </div>
  );
}

export default Step5Finalisation;
