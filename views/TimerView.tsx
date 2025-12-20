import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { saveSession, saveActiveTimer, getActiveTimer, clearActiveTimer } from '../services/storageService';

export const TimerView: React.FC = () => {
  // State for the timer
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);
  const [lastResumeTime, setLastResumeTime] = useState<number | null>(null);
  
  // State for the "Finish" modal
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [hasPee, setHasPee] = useState(false);
  const [hasPoop, setHasPoop] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  // --- Wake Lock Logic ---
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  };

  // Recover wake lock if tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (wakeLockRef.current !== null && document.visibilityState === 'visible' && isRunning) {
        await requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning]);

  // Initial Load
  useEffect(() => {
    const savedState = getActiveTimer();
    if (savedState) {
      setStartTime(savedState.startTime);
      setAccumulatedSeconds(savedState.accumulatedSeconds);
      
      if (savedState.isRunning && savedState.lastResumeTime) {
        const resumeTime = new Date(savedState.lastResumeTime).getTime();
        setLastResumeTime(resumeTime);
        setIsRunning(true);
        requestWakeLock();
      } else {
        setSeconds(savedState.accumulatedSeconds);
        setIsRunning(false);
      }
    }
  }, []);

  // Update logic to calculate real time difference
  useEffect(() => {
    if (isRunning && lastResumeTime) {
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - lastResumeTime) / 1000);
        setSeconds(accumulatedSeconds + diff);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, lastResumeTime, accumulatedSeconds]);

  // Persistence
  useEffect(() => {
    if (startTime) {
      saveActiveTimer({
        isRunning,
        startTime,
        accumulatedSeconds: isRunning ? accumulatedSeconds : seconds,
        lastResumeTime: isRunning ? new Date(lastResumeTime!).toISOString() : null
      });
    } else {
      clearActiveTimer();
    }
  }, [isRunning, seconds, startTime, accumulatedSeconds, lastResumeTime]);

  const handleStart = () => {
    const now = Date.now();
    if (!startTime) {
      setStartTime(new Date().toISOString());
    }
    setLastResumeTime(now);
    setIsRunning(true);
    requestWakeLock();
  };

  const handlePause = () => {
    setAccumulatedSeconds(seconds);
    setIsRunning(false);
    releaseWakeLock();
  };

  const handleFinishClick = () => {
    setAccumulatedSeconds(seconds);
    setIsRunning(false);
    setShowFinishModal(true);
    releaseWakeLock();
  };

  const handleSaveSession = async () => {
    if (startTime) {
      setIsSaving(true);
      try {
        await saveSession({
          startTime: startTime,
          endTime: new Date().toISOString(),
          durationSeconds: seconds,
          hasPee,
          hasPoop,
        });
        
        // Reset Everything
        setSeconds(0);
        setAccumulatedSeconds(0);
        setIsRunning(false);
        setStartTime(null);
        setLastResumeTime(null);
        setHasPee(false);
        setHasPoop(false);
        setShowFinishModal(false);
        clearActiveTimer();
        releaseWakeLock();
      } catch (e) {
        alert("Erro ao salvar mamada localmente.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (showFinishModal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
        <Card className="w-full max-w-sm p-6 space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Bebê de barriga cheia!</h2>
            <p className="text-gray-500">
              Duração: <span className="font-mono font-bold text-baby-500">{formatTime(seconds)}</span>
            </p>
          </div>

          <div className="space-y-4 text-left">
            <p className="font-medium text-gray-700">O que encontramos na fralda?</p>
            
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${hasPee ? 'border-baby-400 bg-baby-50' : 'border-gray-200'}`}>
              <input 
                type="checkbox" 
                checked={hasPee} 
                onChange={(e) => setHasPee(e.target.checked)}
                className="w-5 h-5 text-baby-500 rounded focus:ring-baby-500"
              />
              <span className="ml-3 font-medium text-gray-700">Xixi 💧</span>
            </label>

            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${hasPoop ? 'border-baby-400 bg-baby-50' : 'border-gray-200'}`}>
              <input 
                type="checkbox" 
                checked={hasPoop} 
                onChange={(e) => setHasPoop(e.target.checked)}
                className="w-5 h-5 text-baby-500 rounded focus:ring-baby-500"
              />
              <span className="ml-3 font-medium text-gray-700">Cocô 💩</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowFinishModal(false)} disabled={isSaving}>
              Voltar
            </Button>
            <Button onClick={handleSaveSession} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Mamada'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-8 px-4">
      {/* Timer Display */}
      <div className="relative flex items-center justify-center w-64 h-64 rounded-full bg-white shadow-xl border-4 border-baby-100 ring-4 ring-baby-50">
        <div className="text-center space-y-1">
          <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {startTime ? "Mamando" : "Pronto"}
          </div>
          <div className="text-6xl font-mono font-bold text-gray-800 tracking-tight">
            {formatTime(seconds)}
          </div>
          {startTime && (
             <div className="text-xs text-baby-400 animate-pulse">
               {isRunning ? "Contando..." : "Pausado"}
             </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-sm space-y-4">
        {!startTime ? (
          <Button 
            size="xl" 
            fullWidth 
            onClick={handleStart}
            className="shadow-baby-200 shadow-xl transform transition hover:-translate-y-1"
          >
            <Play className="mr-2" fill="currentColor" /> Iniciar Mamada
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Button 
              size="lg" 
              variant={isRunning ? "secondary" : "primary"} 
              onClick={isRunning ? handlePause : handleStart}
              className="w-full"
            >
              {isRunning ? (
                <><Pause className="mr-2" fill="currentColor" /> Pausar</>
              ) : (
                <><Play className="mr-2" fill="currentColor" /> Retomar</>
              )}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleFinishClick}
              className="w-full"
            >
              <Square className="mr-2" fill="currentColor" size={18} /> Acabou
            </Button>
          </div>
        )}
      </div>
      
      {isRunning && (
        <p className="text-[10px] text-gray-400 animate-pulse uppercase tracking-widest font-bold">
          Tela mantida acesa automaticamente
        </p>
      )}
    </div>
  );
};
