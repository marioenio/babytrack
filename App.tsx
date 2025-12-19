import React, { useState, useEffect } from 'react';
import { ViewState, BabyProfile } from './types';
import { Navbar } from './components/Navbar';
import { TimerView } from './views/TimerView';
import { HistoryView } from './views/HistoryView';
import { CareView } from './views/CareView';
import { DiaryView } from './views/DiaryView';
import { AuthView } from './views/AuthView';
import { Settings, LogOut } from 'lucide-react';
import { clearAllData, getProfile } from './services/storageService';

const App: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('timer');

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setBabyProfile(profile);
      setIsConfigured(true);
    }
  }, []);

  const handleSetupComplete = (profile: BabyProfile) => {
    setBabyProfile(profile);
    setIsConfigured(true);
  };

  const handleReset = () => {
    if (confirm("Isso apagará todos os dados (mamadas, pesos, etc.) permanentemente deste aparelho. Tem certeza?")) {
      clearAllData();
      window.location.reload();
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'timer':
        return <TimerView />;
      case 'history':
        return <HistoryView />;
      case 'care':
        return <CareView />;
      case 'diary':
        return <DiaryView />;
      default:
        return <TimerView />;
    }
  };

  if (!isConfigured) {
    return <AuthView onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
            <h1 className="text-xl font-black bg-gradient-to-r from-baby-400 to-baby-600 bg-clip-text text-transparent leading-tight">
              BabyTrack
            </h1>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Acompanhando {babyProfile?.name}
            </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReset}
            className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors"
            title="Apagar tudo e recomeçar"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto w-full pt-4">
        {renderView()}
      </main>

      {/* Navigation */}
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;