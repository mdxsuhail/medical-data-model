import { BiomarkerData, BiomarkerRow } from '../types';

export const getStatus = (name: string, value: number): 'Normal' | 'Elevated' | 'Critical' => {
  switch (name) {
    case 'Troponin':
      if (value >= 0.40) return 'Critical';
      if (value >= 0.05) return 'Elevated';
      return 'Normal';

    case 'Glucose':
      if (value >= 200) return 'Critical';
      if (value >= 141) return 'Elevated';
      return 'Normal'; 
    
    case 'HbA1c':
      if (value >= 6.5) return 'Critical';
      if (value >= 5.7) return 'Elevated';
      return 'Normal';

    case 'Creatinine':
      if (value >= 2.0) return 'Critical';
      if (value >= 1.4) return 'Elevated';
      return 'Normal'; 
      
    case 'ALT':
      if (value >= 101) return 'Critical';
      if (value >= 56) return 'Elevated';
      return 'Normal';
      
    default:
      return 'Normal';
  }
};

export const getUnit = (name: string) => {
  switch (name) {
    case 'Troponin': return 'ng/mL';
    case 'Glucose': return 'mg/dL';
    case 'HbA1c': return '%';
    case 'Creatinine': return 'mg/dL';
    case 'ALT': return 'U/L';
    default: return '';
  }
};

export const generateInitialTableData = (): BiomarkerRow[] => {
  const data: BiomarkerRow[] = [];
  
  const scenarios = [
    { name: 'Troponin', value: 0.42 },  
    { name: 'Glucose', value: 165 },    
    { name: 'HbA1c', value: 5.4 },      
    { name: 'Creatinine', value: 2.1 }, 
    { name: 'ALT', value: 75 },         
    { name: 'Glucose', value: 95 },     
    { name: 'HbA1c', value: 6.8 },      
    { name: 'Troponin', value: 0.01 },  
    { name: 'ALT', value: 25 },         
    { name: 'Creatinine', value: 1.5 }, 
  ];

  scenarios.forEach((scenario, index) => {
    const name = scenario.name as any;
    const value = scenario.value;
    const status = getStatus(name, value);
    
    const date = new Date();
    date.setMinutes(date.getMinutes() - (index * 12));
    const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    data.push({
      id: `rec-${1000 + index}`,
      timestamp: timeStr,
      biomarkerName: name,
      value,
      unit: getUnit(name),
      status
    });
  });
  
  return data;
};

export const generateBiomarkerData = (): BiomarkerData[] => {
  const data: BiomarkerData[] = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    
    const h = time.getHours();
    
    let mealSpike = 0;
    if ((h >= 8 && h <= 10) || (h >= 13 && h <= 15) || (h >= 19 && h <= 21)) {
        mealSpike = Math.random() * 40; 
    }
    const glucose = Math.floor(95 + (Math.sin(i * 0.5) * 10) + mealSpike + (Math.random() * 10));

    const troponin = parseFloat((0.01 + (Math.random() * 0.02)).toFixed(3));
    const hba1c = parseFloat((5.4 + (Math.random() * 0.1)).toFixed(1));
    const creatinine = parseFloat((0.9 + (Math.sin(i * 0.2) * 0.2) + (Math.random() * 0.1)).toFixed(2));
    const alt = Math.floor(25 + (Math.cos(i * 0.3) * 10) + (Math.random() * 5));
    
    data.push({
      timestamp: `${hours}:${minutes}`,
      troponin,
      glucose,
      hba1c,
      creatinine,
      alt
    });
  }
  return data;
};

export const getLatestStats = (data: BiomarkerData[]) => {
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  
  return {
    latest,
    trends: {
      troponin: latest.troponin > previous.troponin ? 'up' : 'down',
      glucose: latest.glucose > previous.glucose ? 'up' : 'down',
      hba1c: latest.hba1c > previous.hba1c ? 'up' : 'down',
      creatinine: latest.creatinine > previous.creatinine ? 'up' : 'down',
      alt: latest.alt > previous.alt ? 'up' : 'down',
    }
  };
};