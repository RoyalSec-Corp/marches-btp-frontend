import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiArrowLeftLine, RiShieldCheckLine } from 'react-icons/ri';

function Step3Finalisation({ formData, setFormData, prevStep }) {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckbox = (field) => { setFormData({ ...formData, [field]: !formData[field] }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.acceptTerms) return setErrorMsg('Vous devez accepter les conditions generales pour continuer.');
    const missingFields = [];
    const requiredFields = { 'Nom de l\'entreprise': formData.companyName, 'SIRET': formData.siret, 'Forme juridique': formData.legalForm, 'Nom': formData.lastName, 'Prenom': formData.firstName, 'Fonction': formData.position, 'Telephone': formData.phone, 'Adresse': formData.address, 'Ville': formData.city, 'Code postal': formData.postalCode, 'Pays': formData.country, 'Email': formData.email, 'Mot de passe': formData.password, 'Code NAF/APE': formData.nafCode };
    for (const [label, value] of Object.entries(requiredFields)) { if (!value || value.trim() === '') missingFields.push(label); }
    if (missingFields.length > 0) return setErrorMsg(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`);
    const formatErrors = [];
    if (!/^\d{14}$/.test(formData.siret)) formatErrors.push('Le numero SIRET doit contenir 14 chiffres.');
    if (!/^\d{5}$/.test(formData.postalCode)) formatErrors.push('Le code postal doit contenir 5 chiffres.');
    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(formData.email)) formatErrors.push('L\'adresse email est invalide.');
    if (!/^\+?\d{10,15}$/.test(formData.phone)) formatErrors.push('Le numero de telephone est invalide.');
    if (formData.nafCode && !/^\d{4}[A-Z]$/i.test(formData.nafCode)) formatErrors.push('Le code NAF/APE doit etre au format 4 chiffres + 1 lettre.');
    if (formatErrors.length > 0) return setErrorMsg(formatErrors.join(' '));
    const payload = { nom_entreprise: formData.companyName, siret: formData.siret, forme_juridique: formData.legalForm, nom: formData.lastName, prenom: formData.firstName, telephone: formData.phone, fonction: formData.position, adresse: formData.address, ville: formData.city, code_postal: formData.postalCode, pays: formData.country, email: formData.email, password: formData.password, naf_code: formData.nafCode || null };
    try {
      setIsSubmitting(true);
      const res = await axios.post(process.env.REACT_APP_API_URL + '/api/auth/register_entreprise', payload, { headers: { 'Content-Type': 'application/json' } });
      if (res.status === 201) { alert('Compte entreprise cree avec succes !'); navigate('/connexion'); }
    } catch (error) {
      if (error.response?.data?.code === 'EMAIL_ALREADY_EXISTS') return setErrorMsg('Cet email est deja utilise.');
      const msg = error.response?.data?.error || 'Une erreur est survenue.';
      setErrorMsg(msg);
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Finalisation de l'inscription</h2>
      <div className="space-y-4 mb-6">
        <div className="flex items-start"><div className={`custom-checkbox mt-1 ${formData.acceptTerms ? 'checked' : ''}`} onClick={() => handleCheckbox('acceptTerms')}></div><label className="ml-2 text-sm text-gray-600 cursor-pointer">J'accepte les <a href="#" className="text-primary hover:underline">conditions generales d'utilisation</a> et la <a href="#" className="text-primary hover:underline">politique de confidentialite</a> de Marches BTP</label></div>
        <div className="flex items-start"><div className={`custom-checkbox mt-1 ${formData.acceptMarketing ? 'checked' : ''}`} onClick={() => handleCheckbox('acceptMarketing')}></div><label className="ml-2 text-sm text-gray-600 cursor-pointer">J'accepte de recevoir des informations commerciales et des actualites de Marches BTP</label></div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4"><div className="flex items-start"><div className="w-10 h-10 flex items-center justify-center text-primary mr-3 flex-shrink-0"><RiShieldCheckLine className="text-2xl" /></div><div><h4 className="font-medium text-gray-900 mb-1">Securite des donnees</h4><p className="text-sm text-gray-600">Vos donnees sont securisees et cryptees. Nous respectons le RGPD et ne partageons jamais vos informations avec des tiers sans votre consentement.</p></div></div></div>
      </div>
      {errorMsg && <div className="text-red-500 text-sm mb-4">{errorMsg}</div>}
      <div className="pt-4 flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-button font-medium flex items-center"><RiArrowLeftLine className="mr-2" /> Precedent</button>
        <button type="submit" disabled={isSubmitting} className={`bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-primary/90 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>{isSubmitting ? 'Creation en cours...' : 'Creer mon compte entreprise'}</button>
      </div>
    </form>
  );
}

export default Step3Finalisation;
