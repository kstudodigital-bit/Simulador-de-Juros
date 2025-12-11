export enum PeriodType {
  YEARS = 'anos',
  MONTHS = 'meses'
}

export enum RateType {
  YEARLY = 'anual',
  MONTHLY = 'mensal'
}

export interface SimulationParams {
  initialValue: number;
  monthlyContribution: number;
  interestRate: number;
  interestRateType: RateType;
  period: number;
  periodType: PeriodType;
}

export interface MonthData {
  month: number;
  totalInvested: number;
  totalInterest: number;
  totalAmount: number;
}

export interface SimulationResult {
  breakdown: MonthData[];
  summary: {
    totalInvested: number;
    totalInterest: number;
    finalAmount: number;
  };
}