import React from 'react';
import { VibeEntry } from '../types';
import { VibeCard } from './VibeCard';

interface VibeFeedProps {
  entries: VibeEntry[];
  onDelete: (id: string) => void;
}

export const VibeFeed: React.FC<VibeFeedProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner">
          <span className="text-4xl">✨</span>
        </div>
        <h2 className="text-xl font-semibold text-slate-300 mb-2">등록된 Vibe가 없습니다</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          '새 Vibe' 버튼을 눌러 코딩 결과물을 팀과 공유해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {entries.map(entry => (
        <div key={entry.id} className="h-full">
          <VibeCard entry={entry} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};