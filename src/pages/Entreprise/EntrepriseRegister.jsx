import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Step1EntrepriseInfo from './components/Step1EntrepriseInfo';
import Step2ResponsableInfo from './components/Step2ResponsableInfo';
import Step3Finalisation from './components/Step3Finalisation';
import SidebarInfosEntreprise from './components/SidebarInfosEntreprise';
import StepIndicator from './components/StepIndicator';
import axios from 'axios';

function EntrepriseRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '', legalForm: '', siret: '', nafCode: '', address: '', postalCode: '', city: '', country: '', sector: '',
    firstName: '', lastName: '', phone: '', position: '', email: '', password: '',
    acceptTerms: false, acceptMarketing: false,
  });
  const [submitError, setSubmitError] = useState(null);

  const nextStep = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSubmit = async () => {
    try {
      setSubmitError(null);
      const payload = {
        email: formData.email, password: formData.password, companyName: formData.companyName,
        siret: formData.siret, address: formData.address, city: formData.city, postalCode: formData.postalCode,
        country: formData.country, nom: formData.lastName, prenom: formData.firstName,
        fonction: formData.position, telephone: formData.phone, nafCode: formData.nafCode || null,
      };
      const response = await axios.post('/api/auth/register_entreprise', payload);
      if (response.status === 201) navigate('/entreprise/dashboard');
    } catch (error) {
      if (error.response?.data?.code === 'EMAIL_ALREADY_EXISTS') setSubmitError('Un compte avec cet email existe deja.');
      else setSubmitError('Une erreur est survenue. Veuillez reessayer.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <header className="sticky top-0 z-50 bg-white shadow-sm mb-6">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center"><h1 className="text-3xl font-['Pacifico'] text-primary">Marches BTP</h1></div>
          <div className="flex items-center space-x-8"><Link to="/" className="text-gray-700 hover:text-primary font-medium flex items-center"><i className="ri-arrow-left-line mr-2"></i> Retour a l'accueil</Link></div>
        </div>
        <StepIndicator currentStep={currentStep} />
      </header>
      <main className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-7/12">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Inscription Entreprise BTP</h1>
              <p className="text-gray-600 mb-8">Completez le formulaire ci-dessous pour creer votre compte entreprise et acceder a tous nos services.</p>
              {submitError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{submitError}</div>}
              {currentStep === 1 && <Step1EntrepriseInfo formData={formData} setFormData={setFormData} nextStep={nextStep} />}
              {currentStep === 2 && <Step2ResponsableInfo formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
              {currentStep === 3 && <Step3Finalisation formData={formData} setFormData={setFormData} prevStep={prevStep} handleSubmit={handleSubmit} />}
            </div>
          </div>
          <div className="lg:w-5/12"><SidebarInfosEntreprise /></div>
        </div>
      </main>
    </div>
  );
}

export default EntrepriseRegister;
