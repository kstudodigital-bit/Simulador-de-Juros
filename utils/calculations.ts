import { SimulationParams, MonthData, SimulationResult, RateType, PeriodType } from '../types';

export const calculateCompoundInterest = (params: SimulationParams): SimulationResult => {
  const {
    initialValue,
    monthlyContribution,
    interestRate,
    interestRateType,
    period,
    periodType,
  } = params;

  // Convert period to months
  const totalMonths = periodType === PeriodType.YEARS ? period * 12 : period;

  // Convert rate to monthly decimal
  // If yearly, we calculate equivalent monthly rate: (1 + r)^1/12 - 1
  // If monthly, just rate / 100
  let monthlyRate = 0;
  if (interestRateType === RateType.YEARLY) {
    monthlyRate = Math.pow(1 + interestRate / 100, 1 / 12) - 1;
  } else {
    monthlyRate = interestRate / 100;
  }

  const breakdown: MonthData[] = [];
  let currentAmount = initialValue;
  let totalInvested = initialValue;

  // Add initial state (Month 0)
  breakdown.push({
    month: 0,
    totalInvested: initialValue,
    totalInterest: 0,
    totalAmount: initialValue,
  });

  for (let i = 1; i <= totalMonths; i++) {
    const interestEarned = currentAmount * monthlyRate;
    currentAmount += interestEarned + monthlyContribution;
    totalInvested += monthlyContribution;

    breakdown.push({
      month: i,
      totalInvested: Number(totalInvested.toFixed(2)),
      totalInterest: Number((currentAmount - totalInvested).toFixed(2)),
      totalAmount: Number(currentAmount.toFixed(2)),
    });
  }

  return {
    breakdown,
    summary: {
      totalInvested: Number(totalInvested.toFixed(2)),
      totalInterest: Number((currentAmount - totalInvested).toFixed(2)),
      finalAmount: Number(currentAmount.toFixed(2)),
    },
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};