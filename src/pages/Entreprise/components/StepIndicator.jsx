import React from 'react';

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Informations entreprise' },
    { number: 2, label: 'Coordonnees responsable' },
    { number: 3, label: 'Finalisation' },
  ];

  return (
    <div className="w-full px-6 pb-4">
      <div className="flex items-center mb-2">
        <div className="flex-1 relative h-1 bg-gray-200 rounded">
          <div className="absolute top-0 left-0 h-1 bg-primary rounded transition-all duration-300" style={{ width: currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%' }}></div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        {steps.map((step) => (<span key={step.number} className={`${currentStep === step.number ? 'font-medium text-primary' : ''}`}>{step.number}. {step.label}</span>))}
      </div>
    </div>
  );
}

export default StepIndicator;
