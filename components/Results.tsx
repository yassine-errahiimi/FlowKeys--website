
import React from 'react';
import { TestStats } from '../types';

interface ResultsProps {
  stats: TestStats | null;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ stats, onReset }) => {
  if (!stats) return null;

  return (
    <div className="w-full max-w-4xl animate-in zoom-in-95 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">PERFORMANCE <span className="text-sky-500 dark:text-cyan-400 underline decoration-sky-500/20 dark:decoration-cyan-500/20">REPORT</span></h2>
        <p className="text-slate-500 uppercase tracking-[0.3em] text-xs font-bold">Flow state achieved successfully</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 glass p-12 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-sky-500 dark:bg-cyan-500 shadow-xl"></div>
          <span className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mb-4">Words Per Minute</span>
          <span className="text-9xl font-black mono text-slate-900 dark:text-white tracking-tighter">{stats.wpm}</span>
        </div>
        
        <div className="md:col-span-2 glass p-12 rounded-[2.5rem] flex flex-col items-center justify-center">
          <span className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mb-4">Accuracy Rate</span>
          <span className="text-9xl font-black mono text-sky-600 dark:text-cyan-400 tracking-tighter">{stats.accuracy}%</span>
        </div>

        <div className="glass p-8 rounded-[2.5rem] flex flex-col items-center">
          <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Duration</span>
          <span className="text-4xl font-black mono text-slate-900 dark:text-white">{stats.time}s</span>
        </div>

        <div className="glass p-8 rounded-[2.5rem] flex flex-col items-center">
          <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Correct</span>
          <span className="text-4xl font-black mono text-slate-900 dark:text-white">{stats.correctChars}</span>
        </div>

        <div className="glass p-8 rounded-[2.5rem] flex flex-col items-center border-red-500/10">
          <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Incorrect</span>
          <span className="text-4xl font-black mono text-red-500">{stats.incorrectChars}</span>
        </div>

        <div className="glass p-8 rounded-[2.5rem] flex flex-col items-center">
          <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Errors</span>
          <span className="text-4xl font-black mono text-slate-900 dark:text-white">0</span>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <button 
          onClick={onReset}
          className="group flex items-center gap-4 px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          RESTART SEQUENCE
        </button>
      </div>
    </div>
  );
};
