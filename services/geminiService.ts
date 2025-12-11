import { GoogleGenAI } from "@google/genai";
import { SimulationParams, SimulationResult, RateType, PeriodType } from "../types";
import { formatCurrency } from "../utils/calculations";

const apiKey = process.env.API_KEY;

export const generateFinancialAdvice = async (
  params: SimulationParams,
  result: SimulationResult
): Promise<string> => {
  if (!apiKey) {
    return "API Key não configurada. Por favor, adicione sua chave da API Gemini para receber análises.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Atue como um consultor financeiro experiente no mercado brasileiro.
    Analise a seguinte simulação de investimento:
    
    DADOS DE ENTRADA:
    - Valor Inicial: ${formatCurrency(params.initialValue)}
    - Aporte Mensal: ${formatCurrency(params.monthlyContribution)}
    - Taxa de Juros: ${params.interestRate}% (${params.interestRateType})
    - Período: ${params.period} ${params.periodType}
    
    RESULTADOS:
    - Total Investido: ${formatCurrency(result.summary.totalInvested)}
    - Total em Juros: ${formatCurrency(result.summary.totalInterest)}
    - Montante Final: ${formatCurrency(result.summary.finalAmount)}
    
    Forneça uma análise concisa (máximo 200 palavras) cobrindo:
    1. A eficácia dessa estratégia para longo prazo.
    2. O poder dos juros compostos nesse cenário específico (compare o investido vs. juros).
    3. Uma sugestão ou ponto de atenção (ex: inflação, diversificação).
    
    Use formatação Markdown simples (negrito, listas). Seja encorajador mas realista.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Low latency
      }
    });
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Ocorreu um erro ao conectar com a IA para análise.";
  }
};