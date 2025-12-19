import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { saveProfile, getProfile } from '../services/storageService';
import { BabyProfile } from '../types';
import { Baby, Calendar, User as UserIcon } from 'lucide-react';

interface AuthViewProps {
  onSetupComplete: (profile: BabyProfile) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSetupComplete }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      onSetupComplete(profile);
    }
  }, [onSetupComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !birthDate) {
      setError('Por favor, preencha o nome e a data de nascimento.');
      return;
    }

    const newProfile: BabyProfile = { name, birthDate };
    saveProfile(newProfile);
    onSetupComplete(newProfile);
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:border-baby-400 focus:ring-2 focus:ring-baby-100 outline-none transition-all";

  return (
    <div className="min-h-screen bg-baby-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-baby-100 shadow-xl p-2">
        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="p-4 bg-baby-100 rounded-full text-baby-500 mb-4 shadow-inner">
            <Baby size={56} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">BabyTrack</h1>
          <p className="text-gray-500 text-sm mt-1">Configuração do Perfil</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nome do Bebê</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3.5 text-baby-300" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
                placeholder="Ex: Maria Alice"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Data de Nascimento</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 text-baby-300" size={18} />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          <Button fullWidth size="lg" type="submit" className="py-4 text-lg">
            Começar a Acompanhar
          </Button>
        </form>
        
        <div className="mt-8 mb-4 px-4 text-center">
            <p className="text-[10px] text-gray-400 leading-tight">
                Seus dados são salvos apenas neste dispositivo para sua total privacidade e segurança.
            </p>
        </div>
      </Card>
    </div>
  );
};
