import React, { useState, useEffect } from 'react';
import { RiEyeLine, RiEyeOffLine, RiArrowRightLine } from 'react-icons/ri';

function Step1PersonalInfo({ formData, setFormData, nextStep }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => { validateFields(); }, [formData]);

  const validateFields = () => {
    const newErrors = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'Le prenom est obligatoire.';
    else if (formData.firstName.trim().length < 2) newErrors.firstName = 'Le prenom doit contenir au moins 2 caracteres.';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Le nom est obligatoire.';
    else if (formData.lastName.trim().length < 2) newErrors.lastName = 'Le nom doit contenir au moins 2 caracteres.';
    if (!formData.phone?.trim()) newErrors.phone = 'Le numero de telephone est obligatoire.';
    else if (!/^0[1-9]\d{8}$/.test(formData.phone.trim())) newErrors.phone = 'Format invalide. Exemple : 0612345678';
    if (!formData.email?.trim()) newErrors.email = 'L\'email est obligatoire.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Format d\'email invalide.';
    const pwd = formData.password || '';
    if (!pwd) newErrors.password = 'Le mot de passe est obligatoire.';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd)) newErrors.password = 'Min. 8 caracteres dont au moins 1 minuscule, 1 majuscule et 1 chiffre.';
    const cpwd = formData.confirmPassword || '';
    if (!cpwd) newErrors.confirmPassword = 'La confirmation du mot de passe est obligatoire.';
    else if (cpwd !== pwd) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return newErrors;
  };

  const handleNext = () => { const newErrors = validateFields(); if (Object.keys(newErrors).length === 0) nextStep(); };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Prenom *</label><input type="text" className={`w-full px-4 py-3 border rounded-lg text-sm ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Votre prenom" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />{errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label><input type="text" className={`w-full px-4 py-3 border rounded-lg text-sm ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Votre nom" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />{errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}</div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Telephone mobile *</label><input type="tel" className={`w-full px-4 py-3 border rounded-lg text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="0612345678" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />{errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Adresse email *</label><input type="email" className={`w-full px-4 py-3 border rounded-lg text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="votre@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}</div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="relative"><label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label><input type={showPassword ? 'text' : 'password'} className={`w-full px-4 py-3 border rounded-lg text-sm pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Min. 8 caracteres" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /><button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <RiEyeOffLine className="text-gray-400" /> : <RiEyeLine className="text-gray-400" />}</button>{errors.password ? <p className="text-red-500 text-sm mt-1">{errors.password}</p> : <p className="text-xs text-gray-500 mt-1">Doit contenir au moins une minuscule, une majuscule et un chiffre.</p>}</div>
        <div className="relative"><label className="block text-sm font-medium text-gray-700 mb-2">Confirmer mot de passe *</label><input type={showConfirmPassword ? 'text' : 'password'} className={`w-full px-4 py-3 border rounded-lg text-sm pr-12 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} placeholder="Confirmez votre mot de passe" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} /><button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <RiEyeOffLine className="text-gray-400" /> : <RiEyeLine className="text-gray-400" />}</button>{errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}</div>
      </div>
      <div className="flex justify-end"><button type="button" onClick={handleNext} disabled={!isValid} className={`px-6 py-3 rounded-button font-medium flex items-center gap-2 ${isValid ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Suivant <RiArrowRightLine /></button></div>
    </div>
  );
}

export default Step1PersonalInfo;
