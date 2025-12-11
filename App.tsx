import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  PiggyBank, 
  DollarSign,
  Calendar,
  Percent
} from 'lucide-react';
import { PeriodType, RateType, SimulationParams } from './types';
import { calculateCompoundInterest, formatCurrency } from './utils/calculations';
import { InputGroup } from './components/InputGroup';
import SummaryCard from './components/SummaryCard';
import ResultsChart from './components/ResultsChart';
import { AIAnalysis } from './components/AIAnalysis';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    initialValue: 1000,
    monthlyContribution: 500,
    interestRate: 10,
    interestRateType: RateType.YEARLY,
    period: 10,
    periodType: PeriodType.YEARS,
  });

  const results = useMemo(() => calculateCompoundInterest(params), [params]);

  const updateParam = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-3">
              <Calculator className="w-8 h-8 text-emerald-600" />
              Simulador de Juros
            </h1>
            <p className="mt-2 text-lg text-slate-600 max-w-2xl">
              Planeje seu futuro financeiro calculando o poder dos juros compostos.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-sm text-slate-400 font-medium">
             v2.0 • React + Gemini AI
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                  Parâmetros
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <InputGroup
                  label="Valor Inicial"
                  value={params.initialValue}
                  onChange={(v) => updateParam('initialValue', v)}
                  prefix="R$"
                  step={100}
                />

                <InputGroup
                  label="Aporte Mensal"
                  value={params.monthlyContribution}
                  onChange={(v) => updateParam('monthlyContribution', v)}
                  prefix="R$"
                  step={50}
                />

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <InputGroup
                        label="Taxa de Juros"
                        value={params.interestRate}
                        onChange={(v) => updateParam('interestRate', v)}
                        suffix="%"
                        step={0.1}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 block mb-1">Tipo da Taxa</label>
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => updateParam('interestRateType', RateType.YEARLY)}
                          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${params.interestRateType === RateType.YEARLY ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Anual
                        </button>
                        <button
                          onClick={() => updateParam('interestRateType', RateType.MONTHLY)}
                          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${params.interestRateType === RateType.MONTHLY ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Mensal
                        </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <InputGroup
                        label="Período"
                        value={params.period}
                        onChange={(v) => updateParam('period', v)}
                        step={1}
                        min={1}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 block mb-1">Unidade</label>
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => updateParam('periodType', PeriodType.YEARS)}
                          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${params.periodType === PeriodType.YEARS ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Anos
                        </button>
                        <button
                          onClick={() => updateParam('periodType', PeriodType.MONTHS)}
                          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${params.periodType === PeriodType.MONTHS ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Meses
                        </button>
                      </div>
                   </div>
                </div>

              </div>
            </div>
            
            {/* AI Integration Block - Mobile only (moves to right on desktop) */}
             <div className="lg:hidden">
                 <AIAnalysis params={params} result={results} />
             </div>

          </section>

          {/* Right Column: Results */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard
                label="Valor Total Final"
                value={formatCurrency(results.summary.finalAmount)}
                icon={TrendingUp}
                colorClass="bg-emerald-500 text-emerald-600"
              />
              <SummaryCard
                label="Total Investido"
                value={formatCurrency(results.summary.totalInvested)}
                icon={PiggyBank}
                colorClass="bg-blue-500 text-blue-600"
              />
              <SummaryCard
                label="Total em Juros"
                value={formatCurrency(results.summary.totalInterest)}
                icon={DollarSign}
                colorClass="bg-amber-500 text-amber-600"
                subtext={`+${((results.summary.totalInterest / results.summary.totalInvested) * 100).toFixed(1)}% de rentabilidade`}
              />
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Evolução Patrimonial</h3>
                  <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                          <span className="text-slate-600">Juros</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                          <span className="text-slate-600">Investido</span>
                      </div>
                  </div>
               </div>
               <ResultsChart data={results.breakdown} />
            </div>

             {/* AI Integration Block - Desktop */}
             <div className="hidden lg:block">
                 <AIAnalysis params={params} result={results} />
             </div>

          </section>

        </main>
      </div>
    </div>
  );
};

export default App;