import React, { useState, useCallback } from 'react';
import { VibeEntry } from '../types';
import { analyzePrompt } from '../services/geminiService';
import { SparklesIcon, CodeIcon, GithubIcon, ServerIcon, PlusIcon } from './Icons';
import { PLACEHOLDERS } from '../constants';

interface VibeFormProps {
  onSubmit: (entry: VibeEntry) => void;
  onCancel: () => void;
}

export const VibeForm: React.FC<VibeFormProps> = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    builderUrl: '',
    repoUrl: '',
    deployUrl: '',
    author: '',
  });
  
  const [aiData, setAiData] = useState<{title: string, summary: string, tags: string[]} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = useCallback(async () => {
    if (!formData.prompt.trim()) return;
    
    setAnalyzing(true);
    try {
      const result = await analyzePrompt(formData.prompt);
      setAiData(result);
    } finally {
      setAnalyzing(false);
    }
  }, [formData.prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // If AI didn't run, use defaults or basic extraction
    const finalTitle = aiData?.title || "새로운 Vibe";
    const finalSummary = aiData?.summary || "요약 내용이 없습니다.";
    const finalTags = aiData?.tags || ["Vibe"];

    const newEntry: VibeEntry = {
      id: crypto.randomUUID(),
      ...formData,
      title: finalTitle,
      summary: finalSummary,
      tags: finalTags,
      timestamp: Date.now(),
    };

    // Simulate slight delay for UX
    setTimeout(() => {
      onSubmit(newEntry);
      setLoading(false);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-800 rounded-xl border border-slate-700 p-6 shadow-xl">
      {/* Prompt Section */}
      <div className="mb-6 group">
        <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between items-center">
          <span>프롬프트 <span className="text-red-400">*</span></span>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !formData.prompt}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded border border-brand-500/30 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors ${analyzing ? 'opacity-50 cursor-wait' : ''}`}
          >
            <SparklesIcon className={`w-3 h-3 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? '분석 중...' : 'AI 자동 완성'}
          </button>
        </label>
        <textarea
          name="prompt"
          required
          rows={5}
          value={formData.prompt}
          onChange={handleChange}
          placeholder={PLACEHOLDERS.PROMPT}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none text-sm font-mono"
        />
        {aiData && (
          <div className="mt-3 p-3 bg-brand-900/20 border border-brand-500/20 rounded-lg animate-fade-in">
            <p className="text-xs text-brand-300 font-semibold mb-1">AI 분석 결과:</p>
            <p className="text-sm text-white font-medium">{aiData.title}</p>
            <p className="text-xs text-slate-400 mt-1">{aiData.summary}</p>
            <div className="flex gap-1 mt-2">
                {aiData.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-brand-500/20 text-brand-200 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Builder URL */}
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <CodeIcon className="w-4 h-4 text-slate-400" />
                빌더 URL
            </label>
            <input
                type="url"
                name="builderUrl"
                value={formData.builderUrl}
                onChange={handleChange}
                placeholder={PLACEHOLDERS.BUILDER_URL}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
        </div>

        {/* Repo URL */}
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <GithubIcon className="w-4 h-4 text-slate-400" />
                리포지토리 URL
            </label>
            <input
                type="url"
                name="repoUrl"
                value={formData.repoUrl}
                onChange={handleChange}
                placeholder={PLACEHOLDERS.REPO_URL}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
        </div>

        {/* Deploy URL */}
         <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <ServerIcon className="w-4 h-4 text-slate-400" />
                배포 URL
            </label>
            <input
                type="url"
                name="deployUrl"
                value={formData.deployUrl}
                onChange={handleChange}
                placeholder={PLACEHOLDERS.DEPLOY_URL}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
        </div>

         {/* Author */}
         <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">작성자 (선택)</label>
            <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder={PLACEHOLDERS.AUTHOR}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-brand-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
           {loading ? '게시 중...' : (
               <>
                <PlusIcon className="w-4 h-4" /> 게시
               </>
           )}
        </button>
      </div>
    </form>
  );
};