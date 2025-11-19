import React, { useState } from 'react';
import { VibeEntry } from '../types';
import { CodeIcon, GithubIcon, ServerIcon, ExternalLinkIcon, CopyIcon, TrashIcon } from './Icons';

interface VibeCardProps {
  entry: VibeEntry;
  onDelete: (id: string) => void;
}

export const VibeCard: React.FC<VibeCardProps> = ({ entry, onDelete }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(ts));
  };

  return (
    <article className="bg-surface-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-brand-500/50 transition-colors duration-300 flex flex-col h-full group">
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1" title={entry.title}>{entry.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {entry.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-300 bg-brand-900/30 border border-brand-500/20 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onDelete(entry.id)}
            className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title="삭제"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{entry.summary}</p>

        {/* Prompt Snippet */}
        <div className="bg-slate-900/50 rounded-lg p-3 mb-4 border border-slate-800 relative group/prompt">
          <p className="text-xs text-slate-500 font-mono line-clamp-3 leading-relaxed">
            {entry.prompt}
          </p>
          <button 
            onClick={() => handleCopy(entry.prompt, 'prompt')}
            className="absolute top-2 right-2 p-1 text-slate-500 hover:text-brand-400 bg-slate-900 rounded opacity-0 group-hover/prompt:opacity-100 transition-opacity"
            title="프롬프트 복사"
          >
            <CopyIcon className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-slate-900/50 p-4 border-t border-slate-800 grid grid-cols-3 divide-x divide-slate-800">
        <ActionButton 
          href={entry.builderUrl} 
          icon={<CodeIcon className="w-4 h-4" />} 
          label="빌더" 
          isLink 
        />
        <ActionButton 
          href={entry.repoUrl} 
          icon={<GithubIcon className="w-4 h-4" />} 
          label="리포" 
          isLink 
        />
        <ActionButton 
          href={entry.deployUrl} 
          icon={<ServerIcon className="w-4 h-4" />} 
          label="배포" 
          isLink 
        />
      </div>
      
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
        <span className="text-xs text-slate-600">{entry.author || '익명'}</span>
        <span className="text-[10px] text-slate-700">{formatDate(entry.timestamp)}</span>
      </div>

      {/* Toast Notification for Copy */}
      {copied && (
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in">
          복사됨!
        </div>
      )}
    </article>
  );
};

const ActionButton = ({ href, icon, label, isLink }: { href?: string, icon: React.ReactNode, label: string, isLink?: boolean }) => {
  if (!href) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 text-slate-700 cursor-not-allowed p-1">
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    )
  }

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-brand-400 transition-colors p-1 group relative"
    >
      <span className="group-hover:-translate-y-0.5 transition-transform duration-200">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
      <ExternalLinkIcon className="w-2 h-2 absolute top-1 right-2 opacity-0 group-hover:opacity-50" />
    </a>
  );
}