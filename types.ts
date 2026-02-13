export interface BiomarkerData {
  timestamp: string;
  troponin: number;   // ng/mL
  glucose: number;    // mg/dL
  hba1c: number;      // %
  creatinine: number; // mg/dL
  alt: number;        // U/L
}

export type BiomarkerType = 'troponin' | 'glucose' | 'hba1c' | 'creatinine' | 'alt';

export interface BiomarkerRow {
  id: string;
  timestamp: string;
  biomarkerName: 'Troponin' | 'Glucose' | 'HbA1c' | 'Creatinine' | 'ALT';
  value: number;
  unit: string;
  status: 'Normal' | 'Elevated' | 'Critical';
}

export interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  status: 'Normal' | 'Alert' | 'Warning';
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}