import React, { useState, useEffect, useRef } from 'react';
import { Activity, Droplets, FlaskConical, Search, Bell, AlertCircle, X, Stethoscope, HeartPulse, ActivitySquare } from 'lucide-react';
import StatCard from './StatCard';
import BiomarkerChart from './BiomarkerChart';
import BiomarkerAnalysisTable from './BiomarkerAnalysisTable';
import { generateBiomarkerData, getLatestStats } from '../services/dataService';
import { BiomarkerData, BiomarkerRow } from '../types';

interface DashboardProps {
  historyData: BiomarkerRow[];
  onUpdateHistory: (newData: BiomarkerRow[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ historyData, onUpdateHistory }) => {
  const [data, setData] = useState<BiomarkerData[]>([]);
  
  const [visibleLines, setVisibleLines] = useState({
    troponin: true,
    glucose: true,
    hba1c: false,
    creatinine: true,
    alt: false
  });

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [alerts, setAlerts] = useState<{id: number, message: string}[]>([]);
  const [recommendation, setRecommendation] = useState<string>('Initializing analysis...');
  
  const toastIdRef = useRef(0);

  useEffect(() => {
    setData(generateBiomarkerData());

    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        const last = prevData[prevData.length - 1];
        
        const nextTime = new Date();
        const hours = nextTime.getHours().toString().padStart(2, '0');
        const minutes = nextTime.getMinutes().toString().padStart(2, '0');
        
        const newPoint: BiomarkerData = {
          timestamp: `${hours}:${minutes}`,
          troponin: Math.max(0, parseFloat((last.troponin + (Math.random() * 0.01 - 0.005)).toFixed(3))),
          glucose: Math.max(60, Math.floor(last.glucose + (Math.random() * 10 - 5))),
          hba1c: last.hba1c, // HbA1c is stable
          creatinine: Math.max(0.5, parseFloat((last.creatinine + (Math.random() * 0.1 - 0.05)).toFixed(2))),
          alt: Math.max(10, Math.floor(last.alt + (Math.random() * 6 - 3)))
        };
        
        newData.push(newPoint);
        return newData;
      });
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const latest = data[data.length - 1];
    analyzeBiomarkers(latest);
  }, [data]);

  const analyzeBiomarkers = (values: BiomarkerData) => {
    // Troponin: Critical >= 0.40
    if (values.troponin >= 0.40) triggerAlert(`Critical: Troponin Level High (${values.troponin} ng/mL)`);
    
    // Glucose: Critical >= 200
    if (values.glucose >= 200) triggerAlert(`Critical: Glucose Very High (${values.glucose} mg/dL)`);
    
    // Creatinine: Critical >= 2.0
    if (values.creatinine >= 2.0) triggerAlert(`Critical: Creatinine High (${values.creatinine} mg/dL)`);
    
    // ALT: Critical >= 101
    if (values.alt >= 101) triggerAlert(`Critical: ALT High (${values.alt} U/L)`);

    // HbA1c: Critical >= 6.5
    if (values.hba1c >= 6.5) triggerAlert(`Critical: HbA1c High (${values.hba1c}%)`);

    let rec = "All monitored biomarkers are within healthy ranges.";
    let flags = [];

    if (values.troponin >= 0.05) flags.push("Troponin Elevated");
    if (values.glucose >= 141) flags.push("Glucose Elevated");
    if (values.hba1c >= 5.7) flags.push("HbA1c Elevated");
    if (values.creatinine >= 1.4) flags.push("Creatinine Elevated");
    if (values.alt >= 56) flags.push("ALT Elevated");

    if (flags.length > 0) {
      rec = `Attention required: ${flags.join(", ")}. Consult a physician.`;
    }
    
    setRecommendation(rec);
  };

  const triggerAlert = (message: string) => {
    setAlerts(prev => {
      if (prev.some(a => a.message === message)) return prev;
      const id = toastIdRef.current++;
      const newAlert = { id, message };
      setTimeout(() => {
        setAlerts(current => current.filter(a => a.id !== id));
      }, 5000);
      return [...prev, newAlert].slice(-3); 
    });
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleLegendToggle = (metric: 'troponin' | 'glucose' | 'hba1c' | 'creatinine' | 'alt') => {
    setVisibleLines(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  if (data.length === 0) return <div className="p-10 text-center text-slate-500">Initializing SB-MED01...</div>;

  const { latest, trends } = getLatestStats(data);
  const previous = data[data.length - 2];

  // Status Helpers
  const getStatus = (type: string, val: number): 'Normal' | 'Warning' | 'Alert' => {
    if (type === 'troponin') return val >= 0.40 ? 'Alert' : val >= 0.05 ? 'Warning' : 'Normal';
    if (type === 'glucose') return val >= 200 ? 'Alert' : val >= 141 ? 'Warning' : 'Normal';
    if (type === 'hba1c') return val >= 6.5 ? 'Alert' : val >= 5.7 ? 'Warning' : 'Normal';
    if (type === 'creatinine') return val >= 2.0 ? 'Alert' : val >= 1.4 ? 'Warning' : 'Normal';
    if (type === 'alt') return val >= 101 ? 'Alert' : val >= 56 ? 'Warning' : 'Normal';
    return 'Normal';
  };

  const isCritical = alerts.length > 0;

  // Calculate dynamic trend values
  const getTrendDiff = (current: number, prev: number, decimals: number = 1) => {
    return Math.abs(current - prev).toFixed(decimals);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      
      <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className="pointer-events-auto bg-rose-500 text-white p-4 rounded-lg shadow-xl flex items-start gap-3 animate-[slideIn_0.3s_ease-out] border-l-4 border-rose-700"
          >
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <div className="flex-1 text-sm font-medium">{alert.message}</div>
            <button onClick={() => removeAlert(alert.id)} className="text-rose-200 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analysis Overview</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time biomarker monitoring • Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 relative rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <Bell size={20} />
            {alerts.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      <div className={`rounded-xl border p-6 transition-colors duration-500 ${
        isCritical ? 'bg-rose-50 border-rose-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${isCritical ? 'bg-rose-100 text-rose-600' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isCritical ? <AlertCircle size={24} /> : <Stethoscope size={24} />}
          </div>
          <div>
            <h3 className={`font-bold text-lg mb-1 ${isCritical ? 'text-rose-800' : 'text-white'}`}>
              AI Health Insight
            </h3>
            <p className={`leading-relaxed ${isCritical ? 'text-rose-700' : 'text-slate-300'}`}>
              {recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Troponin (Cardiac)"
          value={latest.troponin.toFixed(3)}
          unit="ng/mL"
          status={getStatus('troponin', latest.troponin)}
          trend={trends.troponin as 'up' | 'down'}
          trendValue={getTrendDiff(latest.troponin, previous.troponin, 3)}
          icon={<HeartPulse size={24} />}
        />
        <StatCard 
          title="Glucose (Serum)"
          value={latest.glucose.toString()}
          unit="mg/dL"
          status={getStatus('glucose', latest.glucose)}
          trend={trends.glucose as 'up' | 'down'}
          trendValue={`${getTrendDiff(latest.glucose, previous.glucose, 0)}%`}
          icon={<Activity size={24} />}
        />
        <StatCard 
          title="Creatinine (Renal)"
          value={latest.creatinine.toFixed(2)}
          unit="mg/dL"
          status={getStatus('creatinine', latest.creatinine)}
          trend={trends.creatinine as 'up' | 'down'}
          trendValue={`${getTrendDiff(latest.creatinine, previous.creatinine, 2)}%`}
          icon={<FlaskConical size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <BiomarkerChart 
            data={data} 
            visibleLines={visibleLines} 
            onToggle={handleLegendToggle}
          />
        </div>
      </div>

      <BiomarkerAnalysisTable 
        data={historyData}
        onUpdateData={onUpdateHistory}
      />
    </div>
  );
};

export default Dashboard;