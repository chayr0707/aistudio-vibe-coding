import React, { useState, useEffect } from 'react';
import { VibeEntry } from './types';
import { VibeForm } from './components/VibeForm';
import { VibeFeed } from './components/VibeFeed';
import { Header } from './components/Header';

// Mock data to populate if empty
const INITIAL_DATA: VibeEntry[] = [
  {
    id: '1',
    title: '이커머스 대시보드',
    summary: '판매 분석 차트가 포함된 React 기반 관리자 대시보드입니다.',
    prompt: 'Create a dark mode dashboard for an e-commerce site using Recharts for sales data, showing daily revenue and user acquisition.',
    tags: ['Dashboard', 'Analytics', 'Dark Mode'],
    builderUrl: 'https://v0.dev/r/example1',
    repoUrl: 'https://github.com/org/repo1',
    deployUrl: 'https://dashboard-demo.vercel.app',
    author: '김개발',
    timestamp: Date.now() - 10000000
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<'feed' | 'create'>('feed');
  const [entries, setEntries] = useState<VibeEntry[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vibeshare_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
        setEntries(INITIAL_DATA);
      }
    } else {
      setEntries(INITIAL_DATA);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('vibeshare_entries', JSON.stringify(entries));
    }
  }, [entries]);

  const handleAddEntry = (entry: VibeEntry) => {
    setEntries(prev => [entry, ...prev]);
    setView('feed');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentView={view} onViewChange={setView} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {view === 'feed' ? (
          <VibeFeed entries={entries} onDelete={handleDeleteEntry} />
        ) : (
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">결과 공유</h2>
              <p className="text-slate-400">팀을 위한 Vibe Coding 결과물을 아카이브하세요.</p>
            </div>
            <VibeForm onSubmit={handleAddEntry} onCancel={() => setView('feed')} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm mt-auto">
        <p>© {new Date().getFullYear()} VibeShare Internal. Built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;