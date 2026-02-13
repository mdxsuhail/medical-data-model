import React from 'react';
import { FileJson, Download, FileText, AlertTriangle } from 'lucide-react';
import { generateBiomarkerData } from '../services/dataService';

const Reports: React.FC = () => {
  const handleDownload = () => {
    const data = generateBiomarkerData();
    const summary = {
        project: "SB-MED01",
        timestamp: new Date().toISOString(),
        total_readings: data.length,
        status: "Healthy",
        data: data
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sb-med01-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Export analysis and view system logs</p>
        </div>
        <button 
          onClick={handleDownload}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <FileJson size={18} />
          <span>Export JSON Analysis</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="text-slate-400" size={20}/>
                Daily Summary
            </h3>
            <p className="text-sm text-slate-500 mb-6">
                Automated daily digest of glucose and metabolite trends. Includes ML-based anomaly detection highlights.
            </p>
            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
                    <span className="text-slate-700">report_2023_10_24.pdf</span>
                    <Download size={16} className="text-emerald-600 cursor-pointer hover:text-emerald-800"/>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
                    <span className="text-slate-700">report_2023_10_23.pdf</span>
                    <Download size={16} className="text-emerald-600 cursor-pointer hover:text-emerald-800"/>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-rose-500" size={20}/>
                Critical Events Log
            </h3>
             <p className="text-sm text-slate-500 mb-6">
                Detailed logs of all threshold breaches (Glucose &gt; 140 mg/dL or Creatinine &gt; 1.2 mg/dL).
            </p>
             <div className="flex justify-between items-center p-3 bg-rose-50 border border-rose-100 rounded-lg text-sm">
                <span className="text-rose-800 font-medium">Download Critical Event Log</span>
                <Download size={16} className="text-rose-600 cursor-pointer hover:text-rose-800"/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;