import React, { useState, useEffect, useMemo } from 'react';
import { RiArrowRightLine, RiArrowLeftLine, RiFileTextLine, RiShieldCheckLine, RiUser3Line, RiDeleteBinLine, RiUpload2Line } from 'react-icons/ri';

function Step4Location({ formData, setFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({});

  useEffect(() => { return () => { Object.values(previews).forEach(p => p?.url && URL.revokeObjectURL(p.url)); }; }, [previews]);
  useEffect(() => { validateField('adresse', formData.adresse); validateField('ville', formData.ville); validateField('codePostal', formData.codePostal); }, [formData.adresse, formData.ville, formData.codePostal]);

  const validateField = (name, value) => {
    let message = '';
    if (!value || String(value).trim() === '') message = 'Ce champ est obligatoire';
    else if (name === 'codePostal' && !/^\d{5}$/.test(value)) message = 'Le code postal doit contenir 5 chiffres';
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validateFile = (file, { accept, maxMB }) => {
    if (!file) return 'Document requis';
    const okType = accept.split(',').some((t) => { const ext = t.trim().toLowerCase(); if (ext.startsWith('.')) return file.name.toLowerCase().endsWith(ext); return file.type.toLowerCase().startsWith(ext.replace('/*', '')); });
    if (!okType) return 'Type de fichier non autorise';
    const maxBytes = maxMB * 1024 * 1024;
    if (file.size > maxBytes) return `Taille max ${maxMB} Mo`;
    return '';
  };

  const setFile = (key, file, opts) => {
    const err = validateFile(file, opts);
    if (err) { setFormData((prev) => ({ ...prev, [`${key}File`]: null })); setPreviews((prev) => { const old = prev[key]; if (old?.url) URL.revokeObjectURL(old.url); const { [key]: _, ...rest } = prev; return rest; }); setErrors((prev) => ({ ...prev, [key]: err })); return; }
    setFormData((prev) => ({ ...prev, [`${key}File`]: file }));
    const url = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setPreviews((prev) => { const old = prev[key]; if (old?.url) URL.revokeObjectURL(old.url); return { ...prev, [key]: { url, name: file.name, size: file.size } }; });
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const removeFile = (key) => { setFormData((prev) => ({ ...prev, [`${key}File`]: null })); setErrors((prev) => ({ ...prev, [key]: 'Document requis' })); setPreviews((prev) => { const p = prev[key]; if (p?.url) URL.revokeObjectURL(p.url); const { [key]: _, ...rest } = prev; return rest; }); };

  const isFormValid = useMemo(() => formData.adresse && formData.ville && /^\d{5}$/.test(formData.codePostal || '') && formData.kbisFile && formData.assuranceFile && formData.photoFile && formData.carteFile && Object.values(errors).every((err) => !err), [formData, errors]);

  const UploadCard = ({ id, name, label, hint, icon, accept, maxMB }) => {
    const preview = previews[name];
    const hasFile = !!preview;
    return (
      <div className="file-upload-zone rounded-lg p-6 text-center border-2 border-dashed border-gray-300 hover:border-primary hover:bg-blue-50" onClick={() => document.getElementById(id)?.click()} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && document.getElementById(id)?.click()}>
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">{icon}</div>
        {!hasFile ? (<><p className="text-sm font-medium text-gray-700">{label} *</p><p className="text-xs text-gray-500">{hint}</p></>) : (
          <div className="space-y-2">{preview.url ? <img src={preview.url} alt={preview.name} className="mx-auto w-36 h-36 object-cover rounded-lg shadow-sm" onClick={(e) => e.stopPropagation()} /> : <div className="mx-auto w-36 h-36 rounded-lg bg-white flex items-center justify-center shadow-sm"><RiFileTextLine className="text-2xl text-gray-400" /></div>}<div className="text-sm text-gray-700 font-medium truncate">{preview.name}</div><div className="text-xs text-gray-500">{(preview.size / (1024 * 1024)).toFixed(2)} Mo</div><div className="flex items-center justify-center gap-3 pt-1"><button type="button" className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300" onClick={(e) => { e.stopPropagation(); document.getElementById(id)?.click(); }}><RiUpload2Line /> Changer</button><button type="button" className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100" onClick={(e) => { e.stopPropagation(); removeFile(name); }}><RiDeleteBinLine /> Supprimer</button></div></div>
        )}
        <input id={id} name={name} type="file" className="hidden" accept={accept} onChange={(e) => { const file = e.target.files?.[0] || null; setFile(name, file, { accept, maxMB }); }} onClick={(e) => e.stopPropagation()} />
        {errors[name] && <p className="text-red-500 text-xs mt-2">{errors[name]}</p>}
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Localisation</h2>
      <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Adresse complete *</label><input type="text" className={`w-full px-4 py-3 border ${errors.adresse ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm`} placeholder="123 rue de la Republique" value={formData.adresse || ''} onChange={(e) => { setFormData({ ...formData, adresse: e.target.value }); validateField('adresse', e.target.value); }} />{errors.adresse && <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>}</div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label><input type="text" className={`w-full px-4 py-3 border ${errors.ville ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm`} placeholder="Paris" value={formData.ville || ''} onChange={(e) => { setFormData({ ...formData, ville: e.target.value }); validateField('ville', e.target.value); }} />{errors.ville && <p className="text-red-500 text-xs mt-1">{errors.ville}</p>}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label><input type="text" inputMode="numeric" pattern="\d{5}" maxLength={5} className={`w-full px-4 py-3 border ${errors.codePostal ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm`} placeholder="75001" value={formData.codePostal || ''} onChange={(e) => { const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 5); setFormData({ ...formData, codePostal: onlyDigits }); validateField('codePostal', onlyDigits); }} />{errors.codePostal && <p className="text-red-500 text-xs mt-1">{errors.codePostal}</p>}</div>
      </div>
      <div className="mb-8"><h3 className="text-lg font-medium text-gray-900 mb-4">Documents justificatifs</h3><p className="text-sm text-gray-600 mb-4">Obligatoire pour votre credibilite</p><div className="grid md:grid-cols-2 gap-4"><UploadCard id="kbis-input" name="kbis" label="Extrait Kbis / SIRET" hint="PDF, JPG ou PNG - Max 5 Mo" accept=".pdf,.jpg,.jpeg,.png" maxMB={5} icon={<RiFileTextLine className="text-gray-400 text-xl" />} /><UploadCard id="assurance-input" name="assurance" label="Attestation d'assurance RC" hint="PDF, JPG ou PNG - Max 5 Mo" accept=".pdf,.jpg,.jpeg,.png" maxMB={5} icon={<RiShieldCheckLine className="text-gray-400 text-xl" />} /><UploadCard id="photo-input" name="photo" label="Photo d'identite professionnelle" hint="JPG ou PNG - Max 2 Mo" accept=".jpg,.jpeg,.png" maxMB={2} icon={<RiUser3Line className="text-gray-400 text-xl" />} /><UploadCard id="carte-input" name="carte" label="Carte professionnelle BTP" hint="JPG ou PNG - Max 2 Mo" accept=".jpg,.jpeg,.png" maxMB={2} icon={<RiUser3Line className="text-gray-400 text-xl" />} /></div></div>
      <div className="flex justify-between"><button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-button flex items-center gap-2"><RiArrowLeftLine /> Precedent</button><button type="button" onClick={nextStep} disabled={!isFormValid} className={`px-6 py-3 rounded-button flex items-center gap-2 ${isFormValid ? 'bg-primary text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}>Suivant <RiArrowRightLine /></button></div>
    </div>
  );
}

export default Step4Location;
