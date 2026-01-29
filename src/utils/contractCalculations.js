export function calculateContractFees(contractData) {
  const budget = Number(contractData.budget) || 0;
  const duration = Number(contractData.duration) || 0;
  const budgetUnit = contractData.budgetUnit || 'day';
  const durationUnit = contractData.durationUnit || 'jours';

  let baseAmount = 0;
  
  if (budgetUnit === 'day' && durationUnit === 'jours') {
    baseAmount = budget * duration;
  } else if (budgetUnit === 'hour' && durationUnit === 'heures') {
    baseAmount = budget * duration;
  } else if (budgetUnit === 'day' && durationUnit === 'heures') {
    baseAmount = budget * (duration / 8);
  } else if (budgetUnit === 'hour' && durationUnit === 'jours') {
    baseAmount = budget * (duration * 8);
  }

  const commissionRate = 0.05;
  const commission = baseAmount * commissionRate;
  const subtotalHT = baseAmount + commission;
  const tvaRate = 0.20;
  const tva = subtotalHT * tvaRate;
  const totalTTC = subtotalHT + tva;

  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    commission: Math.round(commission * 100) / 100,
    commissionRate,
    subtotalHT: Math.round(subtotalHT * 100) / 100,
    tva: Math.round(tva * 100) / 100,
    tvaRate,
    totalTTC: Math.round(totalTTC * 100) / 100,
    budgetDisplay: `${budget}EUR/${budgetUnit === 'day' ? 'jour' : 'heure'}`,
    durationDisplay: `${duration} ${durationUnit}`,
  };
}

export function formatEuro(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(rate) {
  return `${Math.round(rate * 100)}%`;
}
