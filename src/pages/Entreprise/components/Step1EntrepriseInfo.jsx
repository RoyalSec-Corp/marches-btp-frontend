import React, { useState } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';

function Step1EntrepriseInfo({ formData, setFormData, nextStep }) {
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let message = '';
    switch (name) {
      case 'companyName': if (!value.trim()) message = 'La raison sociale est obligatoire.'; break;
      case 'legalForm': if (!value.trim()) message = 'La forme juridique est obligatoire.'; break;
      case 'siret': if (!/^\d{14}$/.test(value)) message = 'Le numero SIRET doit contenir 14 chiffres.'; break;
      case 'nafCode': if (!value.trim()) message = 'Le code NAF/APE est obligatoire.'; break;
      case 'address': if (!value.trim()) message = 'L\'adresse est obligatoire.'; break;
      case 'postalCode': if (!/^\d{5}$/.test(value)) message = 'Le code postal doit contenir 5 chiffres.'; break;
      case 'city': if (!value.trim()) message = 'La ville est obligatoire.'; break;
      case 'country': if (!value.trim()) message = 'Le pays est obligatoire.'; break;
      case 'sector': if (!value) message = 'Veuillez selectionner un secteur.'; break;
      default: break;
    }
    return message;
  };

  const fieldsToValidate = ['companyName', 'legalForm', 'siret', 'nafCode', 'address', 'postalCode', 'city', 'country', 'sector'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    const newErrors = {};
    fieldsToValidate.forEach((field) => { const message = validateField(field, formData[field]); if (message) newErrors[field] = message; });
    if (Object.keys(newErrors).length > 0) setErrors(newErrors);
    else nextStep();
  };

  const renderError = (field) => errors[field] ? <p className="text-red-500 text-sm mt-1">{errors[field]}</p> : null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de l'entreprise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Raison sociale *</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('companyName')}</div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Forme juridique *</label><input type="text" name="legalForm" value={formData.legalForm} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('legalForm')}</div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Numero SIRET *</label><input type="text" name="siret" value={formData.siret} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('siret')}</div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Code NAF/APE *</label><input type="text" name="nafCode" value={formData.nafCode} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('nafCode')}</div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('address')}</div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label><input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('postalCode')}</div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('city')}</div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('country')}</div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activite principal *</label><select name="sector" value={formData.sector} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"><option value="">Selectionnez votre secteur</option><option value="gros_oeuvre">Gros oeuvre</option><option value="second_oeuvre">Second oeuvre</option><option value="travaux_publics">Travaux publics</option><option value="renovation">Renovation</option><option value="amenagement_paysager">Amenagement paysager</option><option value="electricite">Electricite</option><option value="plomberie">Plomberie</option><option value="menuiserie">Menuiserie</option><option value="peinture">Peinture</option><option value="maconnerie">Maconnerie</option><option value="autre">Autre</option></select>{renderError('sector')}</div>
        </div>
      </div>
      <div className="flex justify-end"><button type="button" onClick={handleNext} className="bg-primary text-white px-6 py-3 rounded-button font-medium flex items-center gap-2">Suivant <RiArrowRightLine /></button></div>
    </div>
  );
}

export default Step1EntrepriseInfo;
