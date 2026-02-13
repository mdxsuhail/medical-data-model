import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Reports from './components/Reports';
import History from './components/History';
import SystemStatusHeader from './components/SystemStatusHeader';
import { generateInitialTableData } from './services/dataService';
import { BiomarkerRow } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [historyData, setHistoryData] = useState<BiomarkerRow[]>([]);

  useEffect(() => {
    // Initialize with some data
    setHistoryData(generateInitialTableData());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-20 lg:ml-64 transition-all duration-300 flex flex-col">
        {/* System Header (Always Visible) */}
        <SystemStatusHeader />

        {/* Dynamic Page Content */}
        <div className="flex-1">
          {activeTab === 'overview' && (
            <Dashboard 
              historyData={historyData} 
              onUpdateHistory={setHistoryData} 
            />
          )}
          {activeTab === 'history' && (
            <History data={historyData} />
          )}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'about' && <About />}
          {activeTab === 'settings' && (
            <div className="p-10 text-center text-slate-400 animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">System Settings</h2>
              <p>Device configuration and threshold management would appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;