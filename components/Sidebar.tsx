import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  FileText, 
  Settings, 
  Activity, 
  LogOut,
  Info
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'history', label: 'History', icon: <History size={20} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
    { id: 'about', label: 'About', icon: <Info size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col shadow-xl">
      <div className="flex items-center justify-center lg:justify-start h-20 border-b border-slate-800 px-0 lg:px-6">
        <div className="bg-emerald-500 p-2 rounded-lg mr-0 lg:mr-3">
          <Activity size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold hidden lg:block tracking-tight">SB-MED01</span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-2 lg:px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-lg transition-colors duration-200 group
              ${activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
              }`}
          >
            <span className={activeTab === item.id ? 'text-emerald-400' : ''}>{item.icon}</span>
            <span className="ml-3 hidden lg:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center justify-center lg:justify-start p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="ml-3 hidden lg:block font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;