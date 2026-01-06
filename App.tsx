
import React, { useState, useEffect, useCallback } from 'react';
import { TypingEngine } from './components/TypingEngine';
import { Results } from './components/Results';
import { Navbar } from './components/Navbar';
import { TestStatus, TestStats } from './types';
import { generateWords } from './data/words';

const App: React.FC = () => {
  const [duration, setDuration] = useState<number>(30);
  const [status, setStatus] = useState<TestStatus>('idle');
  const [words, setWords] = useState<string>(generateWords(100));
  const [stats, setStats] = useState<TestStats | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('flowkeys-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('flowkeys-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setWords(generateWords(100));
    setStats(null);
  }, []);

  const handleFinish = useCallback((finalStats: TestStats) => {
    setStats(finalStats);
    setStatus('finished');
  }, []);

  const handleStart = useCallback(() => {
    setStatus('running');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReset]);

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 pb-12 px-4 transition-colors duration-500">
      <div className="relative z-10 w-full max-w-5xl flex flex-col flex-1 items-center">
        <Navbar 
          duration={duration} 
          setDuration={(d) => { setDuration(d); handleReset(); }} 
          status={status}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="w-full flex-1 flex flex-col items-center justify-center min-h-[60vh] py-12">
          {status !== 'finished' ? (
            <div className={`w-full transition-all duration-1000 ${status === 'running' ? 'scale-105' : ''}`}>
              <TypingEngine 
                words={words} 
                duration={duration} 
                onFinish={handleFinish}
                onStart={handleStart}
                status={status}
                onReset={handleReset}
              />
            </div>
          ) : (
            <Results stats={stats} onReset={handleReset} />
          )}
        </main>

        {status !== 'running' && (
          <div className="w-full mt-32 space-y-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <section className="w-full text-center">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-tight">
                OUR <span className="text-sky-500 dark:text-cyan-400">SERVICES</span> FOR<br/>
                DIGITAL PERFORMANCE.
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-16 text-left">
                <div className="md:col-span-8 glass p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-sky-500/50 dark:hover:border-cyan-500/50 transition-all">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 dark:bg-cyan-500/20 flex items-center justify-center mb-8 border border-sky-500/20 dark:border-cyan-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-sky-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Ultra-Precision Analytics</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed text-lg">
                      We've developed a custom engine that tracks key-by-key metrics to provide 
                      you with the most accurate WPM and typing heatmaps in the industry.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4 glass p-10 rounded-[2.5rem] hover:border-purple-500/50 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-8 border border-purple-500/20 dark:border-purple-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Privacy First</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No tracking, no cookies. Just you and the keyboard.</p>
                </div>

                <div className="md:col-span-4 glass p-10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/20 dark:border-emerald-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Flow State</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Engineered for deep focus and zero distraction.</p>
                </div>

                <div className="md:col-span-8 glass p-10 rounded-[2.5rem] hover:border-sky-500/50 dark:hover:border-blue-500/50 transition-all group">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Custom Training Drills</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                        Tailored word lists designed by linguistic experts to target your specific weak points in muscle memory.
                      </p>
                    </div>
                    <div className="w-full md:w-48 aspect-square bg-slate-900/5 dark:bg-white/5 rounded-3xl border border-slate-900/5 dark:border-white/10 flex items-center justify-center">
                       <span className="mono text-4xl text-sky-600 dark:text-cyan-400 font-bold">A_Z</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full flex flex-col md:flex-row items-center gap-20 py-16">
              <div className="flex-1">
                <span className="text-sky-600 dark:text-cyan-400 font-bold tracking-[0.3em] uppercase text-sm mb-6 block">Our Information</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-8">
                  ELEVATING THE <br/>
                  <span className="text-gradient">TYPING STANDARD.</span>
                </h2>
                <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  <p>
                    FlowKeys isn't just a speed test; it's a high-performance utility designed for engineers, 
                    creatives, and professionals who live in their terminal and text editor.
                  </p>
                </div>
              </div>
              <div className="flex-1 w-full max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Daily Users", val: "12K+" },
                    { label: "Tests Taken", val: "2.4M" },
                    { label: "Avg. Speed", val: "74 WPM" },
                    { label: "Growth", val: "212%" }
                  ].map((stat, i) => (
                    <div key={i} className="glass p-8 rounded-3xl border-slate-900/5 dark:border-white/5 hover:border-sky-500/20 dark:hover:border-cyan-500/20 transition-all text-center">
                      <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 mono tracking-tighter">{stat.val}</div>
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        <footer className="mt-32 w-full flex flex-col items-center">
          <div className="w-full max-w-2xl text-center mb-16">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Ready to reach peak performance?</h4>
            <p className="text-slate-500 mb-8">Join the community of elite typists and start your journey today.</p>
            <button 
              onClick={handleReset}
              className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Start Your First Test
            </button>
          </div>

          <div className="w-full pt-12 pb-12 border-t border-slate-900/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-slate-900 dark:text-white font-bold tracking-tighter">FlowKeys</span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Created by <span className="text-sky-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer">Yassine Errahimi</span>
            </p>

            <div className="flex gap-6">
              {['Twitter', 'Github', 'LinkedIn'].map(social => (
                <a key={social} href="#" className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">{social}</a>
              ))}
            </div>
          </div>
          <p className="text-slate-400 dark:text-slate-700 text-[10px] uppercase tracking-[0.5em] pb-12">© 2025 FlowKeys Precision Digital Systems</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
