import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  unit, 
  status, 
  trend, 
  trendValue, 
  icon,
  active = false,
  onClick
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Alert': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUpRight size={16} />;
      case 'down': return <ArrowDownRight size={16} />;
      default: return <Minus size={16} />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
        active 
          ? 'bg-white border-emerald-500 shadow-lg ring-1 ring-emerald-500/20' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
          {icon}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900">{value}</span>
          <span className="text-sm text-slate-400 font-medium">{unit}</span>
        </div>
      </div>

      <div className={`mt-4 flex items-center text-sm font-medium ${trend === 'up' && status === 'Alert' ? 'text-rose-600' : 'text-slate-500'}`}>
        {getTrendIcon()}
        <span className="ml-1">{trendValue}</span>
        <span className="ml-1 text-slate-400 font-normal">vs last hour</span>
      </div>
    </div>
  );
};

export default StatCard;