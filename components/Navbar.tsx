import React from 'react';
import { ViewState } from '../types';
import { Clock, List, Baby, BookHeart } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'timer' as ViewState, label: 'Mamada', icon: Clock },
    { id: 'history' as ViewState, label: 'Histórico', icon: List },
    { id: 'care' as ViewState, label: 'Cuidados', icon: Baby },
    { id: 'diary' as ViewState, label: 'Diário', icon: BookHeart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-4 shadow-lg z-50 h-20">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 w-full h-full pb-2 ${
                isActive ? 'text-baby-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={isActive ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};