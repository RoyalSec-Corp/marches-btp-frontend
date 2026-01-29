import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { RiArrowDownSLine, RiCheckLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

const inputStyle = "w-full bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400";

const InscriptionAppelOffre = () => {
  const navigate = useNavigate();
  const [entityType, setEntityType] = useState('individual');
  const [legalForm, setLegalForm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiDetails, setApiDetails] = useState([]);

  const [pp, setPP] = useState({ nom: '', prenom: '', dateNaissance: '', telephone: '', email: '', adresse: '', codePostal: '', ville: '', pays: 'France' });
  const [pm, setPM] = useState({ raison_sociale: '', siret: '', forme_juridique: '', representant_nom: '', representant_prenom: '', telephone: '', email: '', adresse: '', codePostal: '', ville: '', pays: 'France' });
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const errors = useMemo(() => {
    const e = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneFr = /^0[1-9]\d{8}$/;
    const siretRegex = /^\d{14}$/;
    if (entityType === 'individual') {
      if (!pp.nom.trim()) e.pp_nom = 'Nom obligatoire.';
      if (!pp.prenom.trim()) e.pp_prenom = 'Prenom obligatoire.';
      if (!pp.dateNaissance) e.pp_date = 'Date de naissance obligatoire.';
      if (!pp.telephone.trim() || !phoneFr.test(pp.telephone)) e.pp_tel = 'Telephone invalide.';
      if (!pp.email.trim() || !emailRegex.test(pp.email)) e.pp_email = 'Email invalide.';
      if (!pp.adresse.trim()) e.pp_adresse = 'Adresse obligatoire.';
      if (!pp.codePostal.trim() || !/^\d{5}$/.test(pp.codePostal)) e.pp_cp = 'Code postal invalide.';
      if (!pp.ville.trim()) e.pp_ville = 'Ville obligatoire.';
    } else {
      if (!pm.raison_sociale.trim()) e.pm_rs = 'Raison sociale obligatoire.';
      if (!pm.siret.trim() || !siretRegex.test(pm.siret)) e.pm_siret = 'SIRET invalide (14 chiffres).';
      if (!legalForm.trim()) e.pm_forme = 'Forme juridique obligatoire.';
      if (!pm.representant_nom.trim()) e.pm_rep_nom = 'Nom du representant obligatoire.';
      if (!pm.representant_prenom.trim()) e.pm_rep_prenom = 'Prenom du representant obligatoire.';
      if (!pm.telephone.trim() || !phoneFr.test(pm.telephone)) e.pm_tel = 'Telephone invalide.';
      if (!pm.email.trim() || !emailRegex.test(pm.email)) e.pm_email = 'Email invalide.';
      if (!pm.adresse.trim()) e.pm_adresse = 'Adresse obligatoire.';
      if (!pm.codePostal.trim() || !/^\d{5}$/.test(pm.codePostal)) e.pm_cp = 'Code postal invalide.';
      if (!pm.ville.trim()) e.pm_ville = 'Ville obligatoire.';
    }
    if (!password) e.password = 'Mot de passe obligatoire.';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) e.password = '8+ caracteres, avec majuscule, minuscule et chiffre.';
    if (!confirm) e.confirm = 'Confirmation requise.';
    else if (confirm !== password) e.confirm = 'Les mots de passe ne correspondent pas.';
    if (!termsAccepted) e.cgu = 'Vous devez accepter les conditions.';
    return e;
  }, [entityType, pp, pm, legalForm, password, confirm, termsAccepted]);

  const isValid = Object.keys(errors).length === 0 && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setApiDetails([]);
    if (!isValid) return;
    setLoading(true);
    try {
      const payload = { entityType, email: entityType === 'individual' ? pp.email : pm.email, password };
      if (entityType === 'individual') Object.assign(payload, { nom: pp.nom, prenom: pp.prenom, telephone: pp.telephone, address: pp.adresse, city: pp.ville, postalCode: pp.codePostal });
      else Object.assign(payload, { companyName: pm.raison_sociale, siret: pm.siret, legalForm, telephone: pm.telephone, address: pm.adresse, city: pm.ville, postalCode: pm.codePostal });
      const url = process.env.REACT_APP_API_URL + '/api/auth/register_appel_offre';
      await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
      alert('Compte Appel d\'offres cree avec succes !');
      navigate('/connexion');
    } catch (err) {
      const api = err.response?.data;
      setApiError(api?.error || api?.message || 'Erreur lors de la creation du compte');
      setApiDetails(api?.details || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription - Publication d'Appel d'Offres BTP</h1>
        <p className="text-gray-600">Creez votre compte pour publier vos appels d'offres sur notre plateforme</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">Type d'entite <span className="text-red-500">*</span></label>
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer" onClick={() => setEntityType('individual')}>
                <input type="radio" name="entityType" value="individual" className="sr-only" checked={entityType === 'individual'} onChange={() => {}} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${entityType === 'individual' ? 'border-primary' : 'border-gray-300'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full bg-primary ${entityType === 'individual' ? '' : 'hidden'}`} />
                </div>
                <span className="text-gray-700">Personne Physique</span>
              </label>
              <label className="flex items-center cursor-pointer" onClick={() => setEntityType('company')}>
                <input type="radio" name="entityType" value="company" className="sr-only" checked={entityType === 'company'} onChange={() => {}} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${entityType === 'company' ? 'border-primary' : 'border-gray-300'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full bg-primary ${entityType === 'company' ? '' : 'hidden'}`} />
                </div>
                <span className="text-gray-700">Personne Morale</span>
              </label>
            </div>
          </div>
          {entityType === 'individual' ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label><input type="text" className={inputStyle} placeholder="Votre nom" value={pp.nom} onChange={(e) => setPP({ ...pp, nom: e.target.value })} />{errors.pp_nom && <p className="text-red-500 text-xs mt-1">{errors.pp_nom}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Prenom *</label><input type="text" className={inputStyle} placeholder="Votre prenom" value={pp.prenom} onChange={(e) => setPP({ ...pp, prenom: e.target.value })} />{errors.pp_prenom && <p className="text-red-500 text-xs mt-1">{errors.pp_prenom}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label><input type="date" className={inputStyle} value={pp.dateNaissance} onChange={(e) => setPP({ ...pp, dateNaissance: e.target.value })} />{errors.pp_date && <p className="text-red-500 text-xs mt-1">{errors.pp_date}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Telephone *</label><input type="tel" className={inputStyle} placeholder="0612345678" value={pp.telephone} onChange={(e) => setPP({ ...pp, telephone: e.target.value })} />{errors.pp_tel && <p className="text-red-500 text-xs mt-1">{errors.pp_tel}</p>}</div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" className={inputStyle} placeholder="votre.email@exemple.fr" value={pp.email} onChange={(e) => setPP({ ...pp, email: e.target.value })} />{errors.pp_email && <p className="text-red-500 text-xs mt-1">{errors.pp_email}</p>}</div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label><input type="text" className={`${inputStyle} mb-4`} placeholder="Numero et nom de rue" value={pp.adresse} onChange={(e) => setPP({ ...pp, adresse: e.target.value })} /><div className="grid grid-cols-3 gap-4"><div><input type="text" className={inputStyle} placeholder="Code postal" value={pp.codePostal} onChange={(e) => setPP({ ...pp, codePostal: e.target.value })} />{errors.pp_cp && <p className="text-red-500 text-xs mt-1">{errors.pp_cp}</p>}</div><div><input type="text" className={inputStyle} placeholder="Ville" value={pp.ville} onChange={(e) => setPP({ ...pp, ville: e.target.value })} />{errors.pp_ville && <p className="text-red-500 text-xs mt-1">{errors.pp_ville}</p>}</div><input type="text" className={inputStyle} placeholder="France" value={pp.pays} onChange={(e) => setPP({ ...pp, pays: e.target.value })} /></div></div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations de l'entreprise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Raison sociale *</label><input type="text" className={inputStyle} placeholder="Nom de votre entreprise" value={pm.raison_sociale} onChange={(e) => setPM({ ...pm, raison_sociale: e.target.value })} />{errors.pm_rs && <p className="text-red-500 text-xs mt-1">{errors.pm_rs}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">SIRET *</label><input type="text" className={inputStyle} placeholder="14 chiffres" value={pm.siret} onChange={(e) => setPM({ ...pm, siret: e.target.value })} />{errors.pm_siret && <p className="text-red-500 text-xs mt-1">{errors.pm_siret}</p>}</div>
              </div>
              <div className="mb-6 relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forme juridique *</label>
                <button type="button" onClick={() => setShowDropdown(!showDropdown)} className={`${inputStyle} flex justify-between items-center text-left`}><span className={legalForm ? 'text-gray-900' : 'text-gray-500'}>{legalForm || 'Selectionner une forme juridique'}</span><RiArrowDownSLine className="text-gray-400" /></button>
                {showDropdown && <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">{['SARL', 'SAS', 'SA', 'EURL', 'SASU', 'Entreprise Individuelle'].map((form) => (<button key={form} type="button" className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm" onClick={() => { setLegalForm(form); setPM({ ...pm, forme_juridique: form }); setShowDropdown(false); }}>{form}</button>))}</div>}
                {errors.pm_forme && <p className="text-red-500 text-xs mt-2">{errors.pm_forme}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom du representant *</label><input type="text" className={inputStyle} placeholder="Nom" value={pm.representant_nom} onChange={(e) => setPM({ ...pm, representant_nom: e.target.value })} />{errors.pm_rep_nom && <p className="text-red-500 text-xs mt-1">{errors.pm_rep_nom}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Prenom du representant *</label><input type="text" className={inputStyle} placeholder="Prenom" value={pm.representant_prenom} onChange={(e) => setPM({ ...pm, representant_prenom: e.target.value })} />{errors.pm_rep_prenom && <p className="text-red-500 text-xs mt-1">{errors.pm_rep_prenom}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Telephone *</label><input type="tel" className={inputStyle} placeholder="0612345678" value={pm.telephone} onChange={(e) => setPM({ ...pm, telephone: e.target.value })} />{errors.pm_tel && <p className="text-red-500 text-xs mt-1">{errors.pm_tel}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" className={inputStyle} placeholder="contact@entreprise.fr" value={pm.email} onChange={(e) => setPM({ ...pm, email: e.target.value })} />{errors.pm_email && <p className="text-red-500 text-xs mt-1">{errors.pm_email}</p>}</div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label><input type="text" className={`${inputStyle} mb-4`} placeholder="Numero et nom de rue" value={pm.adresse} onChange={(e) => setPM({ ...pm, adresse: e.target.value })} /><div className="grid grid-cols-3 gap-4"><div><input type="text" className={inputStyle} placeholder="Code postal" value={pm.codePostal} onChange={(e) => setPM({ ...pm, codePostal: e.target.value })} />{errors.pm_cp && <p className="text-red-500 text-xs mt-1">{errors.pm_cp}</p>}</div><div><input type="text" className={inputStyle} placeholder="Ville" value={pm.ville} onChange={(e) => setPM({ ...pm, ville: e.target.value })} />{errors.pm_ville && <p className="text-red-500 text-xs mt-1">{errors.pm_ville}</p>}</div><input type="text" className={inputStyle} placeholder="France" value={pm.pays} onChange={(e) => setPM({ ...pm, pays: e.target.value })} /></div></div>
              </div>
            </div>
          )}
          <div className="border-t pt-8 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations de connexion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Identifiant (optionnel)</label><input type="text" className={inputStyle} placeholder="Votre identifiant" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label><div className="relative"><input type={showPassword ? 'text' : 'password'} className={`${inputStyle} pr-12`} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <RiEyeLine /> : <RiEyeOffLine />}</button></div>{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}</div>
            </div>
            <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe *</label><div className="relative"><input type={showConfirmPassword ? 'text' : 'password'} className={`${inputStyle} pr-12`} placeholder="********" value={confirm} onChange={(e) => setConfirm(e.target.value)} /><button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <RiEyeLine /> : <RiEyeOffLine />}</button></div>{errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}</div>
            <div className="mb-8"><label className="flex items-start cursor-pointer"><input type="checkbox" className="sr-only" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} /><div className={`terms-checkbox w-5 h-5 border-2 rounded flex items-center justify-center mr-3 mt-0.5 ${termsAccepted ? 'bg-primary border-primary' : 'border-gray-300'}`}>{termsAccepted && <RiCheckLine className="text-white text-sm" />}</div><span className="text-sm text-gray-700">J'accepte les <a href="#" className="text-primary hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-primary hover:underline">politique de confidentialite</a> <span className="text-red-500">*</span></span></label>{errors.cgu && <p className="text-red-500 text-xs mt-2">{errors.cgu}</p>}</div>
          </div>
          {(apiError || apiDetails.length > 0) && <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800"><p className="font-medium">{apiError || 'Erreurs de validation'}</p>{apiDetails.length > 0 && <ul className="list-disc ml-5 mt-1 space-y-1">{apiDetails.map((d, i) => <li key={i}>{(d.param || d.path || 'champ')}: {d.msg || d.message || 'invalide'}</li>)}</ul>}</div>}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t space-y-4 sm:space-y-0">
            <button type="button" className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-button hover:bg-gray-50 transition-colors" onClick={() => window.history.back()}>Retour</button>
            <button type="submit" disabled={!isValid} className={`w-full sm:w-auto px-8 py-3 rounded-button text-white transition-colors ${isValid ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 cursor-not-allowed'}`}>{loading ? 'En cours...' : 'Continuer'}</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default InscriptionAppelOffre;
