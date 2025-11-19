import React from 'react';
import { PlusIcon } from './Icons';

interface HeaderProps {
  currentView: 'feed' | 'create';
  onViewChange: (view: 'feed' | 'create') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onViewChange('feed')}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            VibeShare
          </h1>
        </div>

        <nav>
          {currentView === 'feed' ? (
            <button 
              onClick={() => onViewChange('create')}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md shadow-brand-900/20 active:scale-95"
            >
              <PlusIcon className="w-4 h-4" />
              <span>새 Vibe</span>
            </button>
          ) : (
             <button 
              onClick={() => onViewChange('feed')}
              className="text-slate-400 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              피드로 돌아가기
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};