import React, { useState } from 'react';
import { RiArrowLeftLine, RiArrowRightLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

function Step2ResponsableInfo({ formData, setFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateField = (name, value) => {
    let message = '';
    switch (name) {
      case 'firstName': if (!value.trim()) message = 'Le prenom est obligatoire.'; break;
      case 'lastName': if (!value.trim()) message = 'Le nom est obligatoire.'; break;
      case 'position': if (!value.trim()) message = 'La fonction est obligatoire.'; break;
      case 'phone': if (!/^\+?[0-9]{10,15}$/.test(value)) message = 'Le numero doit contenir entre 10 et 15 chiffres.'; break;
      case 'email': if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value)) message = 'Adresse email invalide.'; break;
      case 'password': if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) message = 'Au moins 8 caracteres, avec majuscule, minuscule et chiffre.'; break;
      case 'confirmPassword': if (value !== formData.password) message = 'Les mots de passe ne correspondent pas.'; break;
      default: break;
    }
    return message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
    setFormData({ ...formData, [name]: value });
    if (name === 'password' && confirmPassword) { const confirmMsg = validateField('confirmPassword', confirmPassword); setErrors((prev) => ({ ...prev, confirmPassword: confirmMsg })); }
  };

  const handleConfirmChange = (e) => { const value = e.target.value; setConfirmPassword(value); const errorMsg = validateField('confirmPassword', value); setErrors({ ...errors, confirmPassword: errorMsg }); };

  const handleNext = () => {
    const newErrors = {};
    ['firstName', 'lastName', 'position', 'phone', 'email', 'password'].forEach((key) => { const message = validateField(key, formData[key]); if (message) newErrors[key] = message; });
    const confirmMsg = validateField('confirmPassword', confirmPassword);
    if (confirmMsg) newErrors.confirmPassword = confirmMsg;
    if (Object.keys(newErrors).length > 0) setErrors(newErrors);
    else nextStep();
  };

  const renderError = (field) => errors[field] ? <p className="text-red-500 text-sm mt-1">{errors[field]}</p> : null;

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Coordonnees du responsable</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Prenom *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('firstName')}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('lastName')}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Fonction *</label><input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('position')}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Telephone *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('phone')}</div>
        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Email professionnel *</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />{renderError('email')}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label><div className="relative"><input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg pr-12" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <RiEyeOffLine /> : <RiEyeLine />}</button></div><p className="text-xs text-gray-500 mt-1">{formData.password.length} / 8 caracteres minimum requis</p>{renderError('password')}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe *</label><div className="relative"><input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={confirmPassword} onChange={handleConfirmChange} className={`w-full px-4 py-2.5 border rounded-lg pr-12 ${confirmPassword && confirmPassword !== formData.password ? 'border-red-500' : 'border-gray-300'}`} /><button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showConfirm ? <RiEyeOffLine /> : <RiEyeLine />}</button></div>{renderError('confirmPassword')}</div>
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 px-6 py-3 rounded flex items-center gap-2"><RiArrowLeftLine /> Precedent</button>
        <button type="button" onClick={handleNext} className="bg-primary text-white px-6 py-3 rounded flex items-center gap-2 font-medium">Suivant <RiArrowRightLine /></button>
      </div>
    </div>
  );
}

export default Step2ResponsableInfo;
