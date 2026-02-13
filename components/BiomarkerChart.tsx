import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceArea
} from 'recharts';
import { BiomarkerData } from '../types';

interface BiomarkerChartProps {
  data: BiomarkerData[];
  visibleLines: {
    troponin: boolean;
    glucose: boolean;
    hba1c: boolean;
    creatinine: boolean;
    alt: boolean;
  };
  onToggle: (metric: 'troponin' | 'glucose' | 'hba1c' | 'creatinine' | 'alt') => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-lg shadow-xl border border-slate-700 text-sm">
        <p className="font-semibold mb-2 border-b border-slate-700 pb-2">Time: {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="capitalize text-slate-300">{entry.name}:</span>
            <span className="font-mono font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BiomarkerChart: React.FC<BiomarkerChartProps> = ({ data, visibleLines, onToggle }) => {
  return (
    <div className="w-full h-[450px] bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">24-Hour Multi-Biomarker Trend</h3>
        <div className="flex gap-4 text-sm">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-500"></div>
             <span className="text-slate-500">Normal Range (Approx)</span>
           </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            stroke="#64748b" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            minTickGap={30}
          />
          
          {/* Left Axis: High Values (Glucose, ALT) */}
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#3b82f6" 
            tick={{ fontSize: 12 }} 
            domain={[0, 250]} 
            label={{ value: 'Glucose/ALT', angle: -90, position: 'insideLeft', offset: 0, style: { fill: '#3b82f6', fontSize: 12, fontWeight: 600 } }}
            hide={!visibleLines.glucose && !visibleLines.alt}
          />

          {/* Right Axis: Low Values (Creatinine, HbA1c, Troponin) */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#8b5cf6" 
            tick={{ fontSize: 12 }} 
            domain={[0, 10]}
            label={{ value: 'Creat/HbA1c', angle: 90, position: 'insideRight', offset: 0, style: { fill: '#8b5cf6', fontSize: 12, fontWeight: 600 } }}
            hide={!visibleLines.creatinine && !visibleLines.hba1c && !visibleLines.troponin}
          />

          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }} 
            onClick={(e) => onToggle(e.dataKey as any)}
            cursor="pointer"
          />

          {/* Healthy Ranges (Approximation for visuals) */}
          {visibleLines.glucose && (
             <ReferenceArea yAxisId="left" y1={70} y2={140} fill="#3b82f6" fillOpacity={0.05} strokeOpacity={0} />
          )}
          {visibleLines.creatinine && (
             <ReferenceArea yAxisId="right" y1={0.7} y2={1.3} fill="#8b5cf6" fillOpacity={0.1} strokeOpacity={0} />
          )}

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="glucose"
            name="Glucose"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            hide={!visibleLines.glucose}
          />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="alt"
            name="ALT"
            stroke="#eab308"
            strokeWidth={2}
            dot={false}
            hide={!visibleLines.alt}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="creatinine"
            name="Creatinine"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            hide={!visibleLines.creatinine}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="hba1c"
            name="HbA1c"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            hide={!visibleLines.hba1c}
          />

           <Line
            yAxisId="right"
            type="monotone"
            dataKey="troponin"
            name="Troponin"
            stroke="#f43f5e"
            strokeWidth={3}
            dot={false}
            hide={!visibleLines.troponin}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BiomarkerChart;