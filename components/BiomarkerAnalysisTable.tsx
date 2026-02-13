import React, { useEffect, useState } from 'react';
import { ArrowUpDown, AlertCircle, CheckCircle2, AlertTriangle, RefreshCw, Plus, Check, Download } from 'lucide-react';
import { BiomarkerRow } from '../types';
import { getStatus, getUnit, generateInitialTableData } from '../services/dataService';

interface BiomarkerAnalysisTableProps {
  data: BiomarkerRow[];
  onUpdateData: (newData: BiomarkerRow[]) => void;
}

const BiomarkerAnalysisTable: React.FC<BiomarkerAnalysisTableProps> = ({ data, onUpdateData }) => {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Form State
  const [formState, setFormState] = useState({
    name: 'Troponin' as 'Troponin' | 'Glucose' | 'HbA1c' | 'Creatinine' | 'ALT',
    value: ''
  });
  const [successToast, setSuccessToast] = useState(false);

  const updateTime = () => {
    const bangaloreTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium'
    });
    setLastUpdated(bangaloreTime);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(() => {
      updateTime(); 
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    // Regenerate random data
    const freshData = generateInitialTableData();
    onUpdateData(freshData);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.value) return;

    const val = parseFloat(formState.value);
    const status = getStatus(formState.name, val);
    
    const timestamp = new Date().toLocaleTimeString('en-GB', { 
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', 
        minute: '2-digit'
    });

    const newRow: BiomarkerRow = {
      id: `manual-${Date.now()}`,
      timestamp,
      biomarkerName: formState.name,
      value: val,
      unit: getUnit(formState.name),
      status
    };

    onUpdateData([newRow, ...data]);
    setFormState(prev => ({ ...prev, value: '' }));
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Biomarker', 'Value', 'Unit', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        [
          `"${row.timestamp}"`,
          `"${row.biomarkerName}"`,
          row.value,
          `"${row.unit}"`,
          `"${row.status}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `biomarker_analysis_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-lg p-6 lg:p-8 transition-all hover:shadow-xl hover:bg-white/70">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Quick Data Entry</h3>
              <p className="text-slate-600 text-sm mt-1">Manually input new sensor readings for instant analysis.</p>
            </div>
            {successToast && (
              <div className="flex items-center gap-2 bg-emerald-100/90 text-emerald-800 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm animate-fade-in backdrop-blur-sm">
                <Check size={18} strokeWidth={3} />
                <span className="text-sm font-bold">Record Added</span>
              </div>
            )}
          </div>

          <form onSubmit={handleAddEntry} className="flex flex-col md:flex-row gap-5 items-end">
            <div className="w-full md:w-1/3 group">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-emerald-600 transition-colors">Biomarker Name</label>
              <div className="relative">
                <select 
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value as any})}
                  className="w-full bg-white/50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 appearance-none shadow-sm transition-all hover:bg-white/80 cursor-pointer"
                >
                  <option value="Troponin">Troponin (ng/mL)</option>
                  <option value="Glucose">Glucose (mg/dL)</option>
                  <option value="HbA1c">HbA1c (%)</option>
                  <option value="Creatinine">Creatinine (mg/dL)</option>
                  <option value="ALT">ALT (U/L)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                  <ArrowUpDown size={16} />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3 group">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-emerald-600 transition-colors">
                Measured Value ({getUnit(formState.name)})
              </label>
              <input 
                type="number" 
                step="0.01"
                placeholder="e.g. 0.00"
                value={formState.value}
                onChange={(e) => setFormState({...formState, value: e.target.value})}
                className="w-full bg-white/50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 shadow-sm transition-all hover:bg-white/80 placeholder:text-slate-400 font-mono"
                required
              />
            </div>

            <div className="w-full md:w-1/3">
              <button 
                type="submit"
                className="w-full text-white bg-slate-900 hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 font-bold rounded-xl text-sm px-5 py-3.5 text-center flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                <Plus size={20} />
                Add Entry
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Biomarker Analysis Log</h3>
            <p className="text-slate-500 text-sm mt-1">
              Last Updated: <span className="font-mono font-medium text-slate-700">{lastUpdated} (IST)</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              Refresh Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Biomarker</th>
                <th className="px-6 py-4">Measured Value</th>
                <th className="px-6 py-4">Analysis Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="biomarker-table-body" className="divide-y divide-slate-100">
              {data.map((row, index) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-slate-50/80 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 font-mono text-slate-600">{row.timestamp}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{row.biomarkerName}</td>
                  <td className="px-6 py-4">
                    <span className="text-slate-900 font-bold text-base">{row.value}</span>
                    <span className="text-slate-400 ml-1 text-xs">{row.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                      <ArrowUpDown size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-500 flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Normal Range
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-shimmer-amber"></div> Elevated
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.6)]"></div> Critical Alert
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiomarkerAnalysisTable;