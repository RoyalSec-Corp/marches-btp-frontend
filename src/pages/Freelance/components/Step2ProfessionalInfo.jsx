import React, { useState } from 'react';

function Step2ProfessionalInfo({ formData, setFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.siret.trim()) newErrors.siret = 'Le numero SIRET est obligatoire.';
    else if (!/^\d{14}$/.test(formData.siret)) newErrors.siret = 'Le SIRET doit contenir exactement 14 chiffres.';
    if (!formData.codeNaf) newErrors.codeNaf = 'Le code NAF / APE est obligatoire.';
    if (!formData.statut) newErrors.statut = 'Le statut professionnel est obligatoire.';
    if (!formData.secteur) newErrors.secteur = 'Le secteur d\'activite est obligatoire.';
    if (!formData.experience) newErrors.experience = 'Les annees d\'experience sont obligatoires.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validate()) nextStep(); };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations professionnelles</h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Numero SIRET *</label><input type="text" inputMode="numeric" maxLength="14" className={`w-full px-4 py-3 border ${errors.siret ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm`} placeholder="14 chiffres" value={formData.siret} onChange={(e) => { const value = e.target.value.replace(/\D/g, ''); setFormData({ ...formData, siret: value }); }} />{errors.siret && <p className="text-red-500 text-xs mt-1">{errors.siret}</p>}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Code NAF / APE *</label><select className={`w-full px-4 py-3 border ${errors.codeNaf ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm`} value={formData.codeNaf} onChange={(e) => setFormData({ ...formData, codeNaf: e.target.value })}><option value="">Selectionnez votre code</option><option value="4312A">4312A - Travaux de terrassement courants</option><option value="4321A">4321A - Travaux d'installation electrique</option><option value="4322A">4322A - Travaux d'installation d'eau et de gaz</option><option value="4331Z">4331Z - Travaux de platrerie</option><option value="4332A">4332A - Travaux de menuiserie bois</option><option value="4333Z">4333Z - Travaux de revetement des sols</option><option value="4334Z">4334Z - Travaux de peinture et vitrerie</option></select>{errors.codeNaf && <p className="text-red-500 text-xs mt-1">{errors.codeNaf}</p>}</div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Statut professionnel *</label><select className={`w-full px-4 py-3 border ${errors.statut ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm`} value={formData.statut} onChange={(e) => setFormData({ ...formData, statut: e.target.value })}><option value="">Selectionnez votre statut</option><option value="auto-entrepreneur">Auto-entrepreneur</option><option value="micro-entrepreneur">Micro-entrepreneur</option><option value="eirl">EIRL</option><option value="eurl">EURL</option><option value="sasu">SASU</option><option value="sarl">SARL</option></select>{errors.statut && <p className="text-red-500 text-xs mt-1">{errors.statut}</p>}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activite principal *</label><select className={`w-full px-4 py-3 border ${errors.secteur ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm`} value={formData.secteur} onChange={(e) => setFormData({ ...formData, secteur: e.target.value })}><option value="">Selectionnez votre secteur</option><option value="plombier">Plombier</option><option value="electricien">Electricien</option><option value="macon">Macon</option><option value="carreleur">Carreleur</option><option value="peintre">Peintre</option><option value="menuisier">Menuisier</option><option value="couvreur">Couvreur</option><option value="chauffagiste">Chauffagiste</option></select>{errors.secteur && <p className="text-red-500 text-xs mt-1">{errors.secteur}</p>}</div>
      </div>
      <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Annees d'experience *</label><select className={`w-full px-4 py-3 border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm`} value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })}><option value="">Selectionnez votre experience</option><option value="0-1">Moins d'1 an</option><option value="1-3">1 a 3 ans</option><option value="3-5">3 a 5 ans</option><option value="5-10">5 a 10 ans</option><option value="10+">Plus de 10 ans</option></select>{errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}</div>
      <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Description rapide de vos services</label><textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none" rows="4" placeholder="Decrivez brievement vos competences et services proposes..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} maxLength="500"></textarea><p className="text-xs text-gray-500 mt-1">Maximum 500 caracteres</p></div>
      <div className="flex justify-between"><button type="button" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-button font-medium" onClick={prevStep}>Precedent</button><button type="button" className="bg-primary text-white px-6 py-3 rounded-button font-medium" onClick={handleNext}>Suivant</button></div>
    </div>
  );
}

export default Step2ProfessionalInfo;
