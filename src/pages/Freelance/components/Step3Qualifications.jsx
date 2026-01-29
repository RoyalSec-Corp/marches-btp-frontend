import React, { useState } from 'react';
import { RiAddLine, RiCloseLine, RiArrowRightLine, RiArrowLeftLine, RiTimeLine, RiCalendarLine, RiFileTextLine } from 'react-icons/ri';

function Step3Qualifications({ formData, setFormData, nextStep, prevStep }) {
  const [qualifications, setQualifications] = useState([]);
  const [errors, setErrors] = useState({});

  const addQualification = () => {
    const input = document.getElementById('qualification-input');
    const qualification = input.value.trim();
    if (qualification && !qualifications.find(q => q.name === qualification)) {
      setQualifications([...qualifications, { name: qualification }]);
      input.value = '';
    }
  };

  const removeQualification = (qualificationName) => setQualifications(qualifications.filter((q) => q.name !== qualificationName));
  const selectPricingMode = (mode) => { setFormData({ ...formData, pricingMode: mode }); setErrors((prev) => ({ ...prev, pricingMode: '' })); };

  const validateField = (field, value) => {
    let error = '';
    if (field === 'pricingMode' && !value) error = 'Veuillez selectionner un mode de facturation.';
    if (field === 'hourlyRate' && formData.pricingMode === 'hourly') {
      if (!value) error = 'Le tarif horaire est obligatoire.';
      else if (value < 15 || value > 150) error = 'Le tarif horaire doit etre entre 15EUR et 150EUR.';
    }
    if (field === 'dailyRate' && formData.pricingMode === 'daily') {
      if (!value) error = 'Le tarif journalier est obligatoire.';
      else if (value < 120 || value > 1200) error = 'Le tarif journalier doit etre entre 120EUR et 1200EUR.';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleNext = () => {
    const newErrors = {};
    if (!formData.pricingMode) newErrors.pricingMode = 'Veuillez selectionner un mode de facturation.';
    if (formData.pricingMode === 'hourly') {
      if (!formData.hourlyRate) newErrors.hourlyRate = 'Le tarif horaire est obligatoire.';
      else if (formData.hourlyRate < 15 || formData.hourlyRate > 150) newErrors.hourlyRate = 'Le tarif horaire doit etre entre 15EUR et 150EUR.';
    }
    if (formData.pricingMode === 'daily') {
      if (!formData.dailyRate) newErrors.dailyRate = 'Le tarif journalier est obligatoire.';
      else if (formData.dailyRate < 120 || formData.dailyRate > 1200) newErrors.dailyRate = 'Le tarif journalier doit etre entre 120EUR et 1200EUR.';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) nextStep();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Qualifications & Tarifs</h2>
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vos qualifications et certifications</h3>
        <p className="text-sm text-gray-600 mb-4">Ajoutez vos qualifications et telechargez les justificatifs associes (facultatif)</p>
        <div className="flex gap-2 mb-4"><input id="qualification-input" type="text" placeholder="Ex: CAP Electricien" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm" /><button type="button" onClick={addQualification} className="bg-secondary text-white px-4 py-3 rounded-button flex items-center gap-2"><RiAddLine /> Ajouter</button></div>
        <div className="space-y-4">{qualifications.length === 0 ? <p className="text-sm text-gray-500 italic">Aucune qualification ajoutee</p> : qualifications.map((q, index) => (<div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2"><div className="flex justify-between items-center text-sm font-medium text-gray-900"><span>{q.name}</span><button type="button" onClick={() => removeQualification(q.name)} className="text-gray-500 hover:text-red-500"><RiCloseLine /></button></div><div className="file-upload-zone rounded-lg p-4 text-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary hover:bg-blue-50" onClick={() => document.getElementById(`qualification-file-${index}`).click()}><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2"><RiFileTextLine className="text-gray-400 text-lg" /></div><p className="text-sm font-medium text-gray-700">Uploader un justificatif pour {q.name}</p><p className="text-xs text-gray-500">PDF, JPG ou PNG - Max 5 Mo</p><input id={`qualification-file-${index}`} name={`qualificationFile_${index}`} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" /></div></div>))}</div>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vos tarifs *</h3>
        <p className="text-sm text-gray-600 mb-6">Definissez vos tarifs pour que les entreprises puissent evaluer votre profil</p>
        <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-3">Mode de facturation prefere *</label>{errors.pricingMode && <p className="text-red-500 text-sm mb-2">{errors.pricingMode}</p>}<div className="grid grid-cols-2 gap-4"><div className={`border-2 rounded-lg p-4 cursor-pointer ${formData.pricingMode === 'hourly' ? 'border-primary bg-blue-50' : 'border-gray-300'}`} onClick={() => selectPricingMode('hourly')}><div className="flex items-center mb-2 text-primary"><RiTimeLine className="mr-2" /> <span className="font-medium">Tarif horaire</span></div><p className="text-sm text-gray-600">Facturation a l'heure de travail</p></div><div className={`border-2 rounded-lg p-4 cursor-pointer ${formData.pricingMode === 'daily' ? 'border-primary bg-blue-50' : 'border-gray-300'}`} onClick={() => selectPricingMode('daily')}><div className="flex items-center mb-2 text-primary"><RiCalendarLine className="mr-2" /> <span className="font-medium">Tarif journalier</span></div><p className="text-sm text-gray-600">Facturation a la journee de travail</p></div></div></div>
        <div className="grid grid-cols-2 gap-6">{formData.pricingMode === 'hourly' && <div><label className="block text-sm font-medium text-gray-700 mb-2">Tarif horaire souhaite (EUR/heure) *</label><div className="relative"><input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-12" placeholder="25" min="10" max="200" value={formData.hourlyRate} onChange={(e) => { setFormData({ ...formData, hourlyRate: e.target.value }); validateField('hourlyRate', e.target.value); }} onBlur={(e) => validateField('hourlyRate', e.target.value)} /><span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">EUR/h</span></div>{errors.hourlyRate && <p className="text-red-500 text-sm">{errors.hourlyRate}</p>}</div>}{formData.pricingMode === 'daily' && <div><label className="block text-sm font-medium text-gray-700 mb-2">Tarif journalier souhaite (EUR/jour) *</label><div className="relative"><input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-12" placeholder="200" min="80" max="1500" value={formData.dailyRate} onChange={(e) => { setFormData({ ...formData, dailyRate: e.target.value }); validateField('dailyRate', e.target.value); }} onBlur={(e) => validateField('dailyRate', e.target.value)} /><span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">EUR/j</span></div>{errors.dailyRate && <p className="text-red-500 text-sm">{errors.dailyRate}</p>}</div>}</div>
      </div>
      <div className="flex justify-between"><button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-button flex items-center gap-2"><RiArrowLeftLine /> Precedent</button><button type="button" onClick={handleNext} className="bg-primary text-white px-6 py-3 rounded-button flex items-center gap-2">Suivant <RiArrowRightLine /></button></div>
    </div>
  );
}

export default Step3Qualifications;
