import React, { useEffect, useState } from 'react';

function InformationsStep({ onNext, onCancel, mode, onDataChange }) {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    budget: '',
    budgetUnit: 'day',      // 'hour' | 'day'
    skills: '',             // string "plomberie, électricité"
    location: '',
    startDate: '',
    duration: '',
    durationUnit: 'jours',  // 'jours' | 'heures'
    description: '',
    requirements: ''
  });

  // Remonter l’état initial au parent
  useEffect(() => {
    if (onDataChange) onDataChange({ ...formData, files });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const filtered = newFiles.filter(
      (nf) => !files.some((ef) => ef.name === nf.name && ef.size === nf.size)
    );
    const next = [...files, ...filtered];
    setFiles(next);
    e.target.value = '';
    if (onDataChange) onDataChange({ ...formData, files: next });
  };

  const handleRemoveFile = (indexToRemove) => {
    const next = files.filter((_, i) => i !== indexToRemove);
    setFiles(next);
    if (onDataChange) onDataChange({ ...formData, files: next });
  };

  const handleInputChange = (field, value) => {
    let v = value;

    // Normalisations légères
    if (field === 'budget' || field === 'duration') {
      v = value === '' ? '' : Number(value);
    }
    if (field === 'skills') {
      // On stocke en string ici, mais on remontera un tableau au parent aussi
      v = value;
    }

    const updated = { ...formData, [field]: v };
    setFormData(updated);

    if (onDataChange) {
      // Expose aussi un tableau de skills normalisé au parent
      const skillsArray = (updated.skills || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      onDataChange({
        ...updated,
        files,
        skillsArray, // pratique pour le service
      });
    }
  };

  const handleNext = () => {
    // Validation basique
    if (
      !formData.title.trim() ||
      formData.budget === '' ||
      !formData.skills.trim() ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (Number(formData.budget) <= 0) {
      alert('Le budget doit être > 0');
      return;
    }
    if (formData.duration === '' || Number(formData.duration) <= 0) {
      alert('La durée doit être > 0');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations de la mission</h2>
        <p className="text-gray-600">Décrivez votre projet pour trouver le freelance idéal</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Champs du formulaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du chantier / mission *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              placeholder="Ex: Rénovation salle de bain"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget par jour/heure *</label>
            <div className="flex space-x-4">
              <input
                type="number"
                min="1"
                step="1"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm"
                placeholder="Ex: 280"
                required
              />
              <select
                value={formData.budgetUnit}
                onChange={(e) => handleInputChange('budgetUnit', e.target.value)}
                className="w-32 px-4 py-3 border border-gray-300 rounded-lg text-sm pr-8"
              >
                <option value="hour">€/heure</option>
                <option value="day">€/jour</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de prestation *</label>
            <select
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-8"
              required
            >
              <option value="">Sélectionner un type</option>
              <option value="plomberie">Plomberie</option>
              <option value="electricite">Électricité</option>
              <option value="maconnerie">Maçonnerie</option>
              <option value="peinture">Peinture</option>
              <option value="carrelage">Carrelage</option>
              <option value="menuiserie">Menuiserie</option>
              <option value="couverture">Couverture</option>
              <option value="chauffage">Chauffage</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète du chantier *</label>
          <div className="relative">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg text-sm"
              placeholder="15 rue de la République, 75001 Paris"
              required
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-map-pin-line text-gray-400 text-sm"></i>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de début estimée *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durée estimée *</label>
            <input
              type="number"
              min="1"
              step="1"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              placeholder="5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unité</label>
            <select
              value={formData.durationUnit}
              onChange={(e) => handleInputChange('durationUnit', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-8"
            >
              <option value="jours">Jours</option>
              <option value="heures">Heures</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée de la mission *</label>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none"
            placeholder="Décrivez précisément les travaux à réaliser..."
            required
          />
        </div>

        {/* Pièces jointes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pièces jointes</label>
          <label
            htmlFor="fileUpload"
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer block"
          >
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <i className="ri-upload-cloud-line text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-600 mb-2">
              Glissez vos fichiers ici ou <span className="text-primary font-medium">cliquez pour parcourir</span>
            </p>
            <p className="text-sm text-gray-500">PDF, JPG, PNG – Max 10 Mo</p>
            <input
              id="fileUpload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>

          {files.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded border"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200"
            onClick={onCancel}
          >
            ← Retour
          </button>
          <button
            type="button"
            className="bg-primary text-white px-8 py-2 rounded-button font-medium hover:bg-blue-600"
            onClick={handleNext}
          >
            Suivant <i className="ri-arrow-right-line ml-2"></i>
          </button>
        </div>
      </form>
    </div>
  );
}

export default InformationsStep;