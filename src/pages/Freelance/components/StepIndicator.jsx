import React from 'react';

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Infos Personnelles' },
    { number: 2, label: 'Infos Professionnelles' },
    { number: 3, label: 'Qualifications & Tarifs' },
    { number: 4, label: 'Localisation' },
    { number: 5, label: 'Finalisation' },
  ];

  const getStepClass = (stepNumber) => {
    if (currentStep === stepNumber) return 'step-active';
    if (currentStep > stepNumber) return 'step-completed';
    return 'step-inactive';
  };

  return (
    <div className="flex items-center justify-center max-w-3xl mx-auto mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getStepClass(step.number)}`}>{step.number}</div>
            <span className={`ml-2 text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</span>
          </div>
          {index < steps.length - 1 && <div className={`flex-1 h-[2px] mx-4 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default StepIndicator;
