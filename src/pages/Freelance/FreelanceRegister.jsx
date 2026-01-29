import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './components/StepIndicator';
import Step1PersonalInfo from './components/Step1PersonalInfo';
import Step2ProfessionalInfo from './components/Step2ProfessionalInfo';
import Step3Qualifications from './components/Step3Qualifications';
import Step4Location from './components/Step4Location';
import Step5Finalisation from './components/Step5Finalisation';
import SidebarInfos from './components/SidebarInfos';

function FreelanceRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '', password: '', confirmPassword: '',
    siret: '', codeNaf: '', statut: '', secteur: '', experience: '', description: '',
    qualifications: [], pricingMode: '', hourlyRate: '', dailyRate: '',
    adresse: '', ville: '', codePostal: '',
    kbisFile: null, assuranceFile: null, photoFile: null, carteFile: null,
    iban: '', titulaireCompte: '', jours: [], heureDebut: '', heureFin: ''
  });
  const [errors, setErrors] = useState({});

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const fd = new FormData();
    fd.append('email', formData.email);
    fd.append('password', formData.password);
    fd.append('nom', formData.lastName);
    fd.append('prenom', formData.firstName);
    if (formData.phone) fd.append('telephone', formData.phone);
    if (formData.adresse) fd.append('adresse', formData.adresse);
    if (formData.ville) fd.append('ville', formData.ville);
    if (formData.codePostal) fd.append('code_postal', formData.codePostal);
    if (formData.siret) fd.append('siret', formData.siret);
    if (formData.codeNaf) fd.append('codeNaf', formData.codeNaf);
    if (formData.statut) fd.append('statut', formData.statut);
    if (formData.secteur) fd.append('secteur', formData.secteur);
    if (formData.experience) fd.append('experience', formData.experience);
    if (formData.description) fd.append('description', formData.description);
    if (formData.pricingMode) fd.append('pricingMode', formData.pricingMode);
    if (formData.hourlyRate) fd.append('hourlyRate', formData.hourlyRate);
    if (formData.dailyRate) fd.append('dailyRate', formData.dailyRate);
    if (formData.iban) fd.append('iban', formData.iban);
    if (formData.titulaireCompte) fd.append('titulaireCompte', formData.titulaireCompte);
    if (Array.isArray(formData.jours)) formData.jours.forEach((j) => fd.append('jours[]', j));
    if (formData.heureDebut) fd.append('heureDebut', formData.heureDebut);
    if (formData.heureFin) fd.append('heureFin', formData.heureFin);
    if (Array.isArray(formData.qualifications) && formData.qualifications.length > 0) fd.append('qualifications', JSON.stringify(formData.qualifications));
    if (formData.kbisFile) fd.append('kbis', formData.kbisFile);
    if (formData.assuranceFile) fd.append('assurance', formData.assuranceFile);
    if (formData.photoFile) fd.append('photo', formData.photoFile);
    if (formData.carteFile) fd.append('carte', formData.carteFile);
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/api/auth/register_freelance', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Inscription reussie');
      navigate('/connexion');
    } catch (error) {
      const api = error.response?.data;
      if (api?.details?.length) {
        alert('Erreurs de validation :\n' + api.details.map(d => `- ${d.param || d.path}: ${d.msg}`).join('\n'));
        const newErrors = {};
        api.details.forEach(d => { newErrors[d.param || d.path] = d.msg; });
        setErrors(newErrors);
        return;
      }
      if (api?.code === 'EMAIL_ALREADY_EXISTS') { setErrors({ email: 'Un compte avec cet email existe deja.' }); alert('Un compte avec cet email existe deja.'); return; }
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="text-center mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription Freelance</h1><p className="text-gray-600">Rejoignez notre plateforme et accedez aux meilleures missions BTP</p></div>
      <StepIndicator currentStep={currentStep} />
      <div className="flex gap-8">
        <div className="flex-1 max-w-4xl">
          {currentStep === 1 && <Step1PersonalInfo formData={formData} setFormData={setFormData} nextStep={nextStep} errors={errors} />}
          {currentStep === 2 && <Step2ProfessionalInfo formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} errors={errors} />}
          {currentStep === 3 && <Step3Qualifications formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} errors={errors} />}
          {currentStep === 4 && <Step4Location formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} errors={errors} />}
          {currentStep === 5 && <Step5Finalisation formData={formData} setFormData={setFormData} prevStep={prevStep} errors={errors} />}
        </div>
        <div className="w-80"><SidebarInfos /></div>
      </div>
    </form>
  );
}

export default FreelanceRegister;
