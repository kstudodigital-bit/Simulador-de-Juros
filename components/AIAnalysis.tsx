import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SimulationParams, SimulationResult } from '../types';
import { generateFinancialAdvice } from '../services/geminiService';

interface AIAnalysisProps {
  params: SimulationParams;
  result: SimulationResult;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ params, result }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    try {
      const text = await generateFinancialAdvice(params, result);
      setAnalysis(text);
    } catch (err) {
      setAnalysis("Erro ao gerar análise. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-indigo-900">Análise Inteligente (IA)</h3>
        </div>
        
        {!analysis && (
            <button
            onClick={handleGenerateAnalysis}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all shadow-md ${
                loading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'
            } flex items-center space-x-2`}
            >
            {loading ? (
                <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analisando...</span>
                </>
            ) : (
                <>
                <span>Gerar Análise</span>
                </>
            )}
            </button>
        )}
      </div>

      {analysis ? (
        <div className="prose prose-sm prose-indigo max-w-none text-slate-700 bg-white p-6 rounded-lg border border-indigo-100/50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ReactMarkdown>{analysis}</ReactMarkdown>
          <div className="mt-4 flex justify-end">
            <button 
                onClick={handleGenerateAnalysis} 
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
                <RefreshCw className="w-3 h-3" /> Atualizar análise
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-indigo-800/70 leading-relaxed">
          Utilize nossa inteligência artificial para receber insights personalizados sobre seu plano de investimento. 
          Descubra se seus aportes são suficientes para seus objetivos e receba dicas de otimização.
        </p>
      )}
    </div>
  );
};