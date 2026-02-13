import React from 'react';
import { BiomarkerRow } from '../types';
import { AlertCircle, CheckCircle2, AlertTriangle, FileClock, Search, Filter } from 'lucide-react';

interface HistoryProps {
  data: BiomarkerRow[];
}

const History: React.FC<HistoryProps> = ({ data }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={12} /> Normal
          </span>
        );
      case 'Elevated':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold animate-shimmer-amber text-amber-800 border border-amber-200 shadow-sm">
            <AlertTriangle size={12} /> Elevated
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse">
            <AlertCircle size={12} /> Critical
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileClock className="text-emerald-600" />
            Patient History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete archive of biomarker measurements and alert events.
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="Search records..." 
               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
             />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Biomarker</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{row.id.slice(-6)}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{row.timestamp}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{row.biomarkerName}</td>
                  <td className="px-6 py-4">
                    <span className="text-slate-900 font-bold">{row.value}</span>
                    <span className="text-slate-400 ml-1 text-xs">{row.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(row.status)}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No records found in history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {data.length} records
        </div>
      </div>
    </div>
  );
};

export default History;