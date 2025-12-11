import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { MonthData } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ResultsChartProps {
  data: MonthData[];
}

const ResultsChart: React.FC<ResultsChartProps> = ({ data }) => {
  // To avoid performance issues with too many data points, we can sample the data if it's too large
  const displayData = data.length > 100 
    ? data.filter((_, index) => index % Math.ceil(data.length / 100) === 0 || index === data.length - 1)
    : data;

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={displayData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => `${value}m`}
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tickFormatter={(value) => 
              new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value)
            }
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), '']}
            labelFormatter={(label) => `Mês ${label}`}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area 
            type="monotone" 
            dataKey="totalAmount" 
            name="Montante Total"
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="totalInvested" 
            name="Total Investido"
            stroke="#6366f1" 
            fillOpacity={1} 
            fill="url(#colorInvested)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;