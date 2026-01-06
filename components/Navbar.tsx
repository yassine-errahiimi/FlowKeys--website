
import React from 'react';
import { TestStatus } from '../types';

interface NavbarProps {
  duration: number;
  setDuration: (d: number) => void;
  status: TestStatus;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ duration, setDuration, status, theme, toggleTheme }) => {
  const durations = [15, 30, 60, 120];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-5xl glass rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-500 shadow-2xl">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 dark:from-cyan-400 dark:to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <svg className="w-5 h-5 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tighter">FlowKeys</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 p-1 bg-slate-900/5 dark:bg-white/5 rounded-xl border border-slate-900/5 dark:border-white/5 transition-opacity duration-300 ${status === 'running' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                  duration === d 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/10 dark:hover:bg-white/10'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl glass hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-400"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
};
