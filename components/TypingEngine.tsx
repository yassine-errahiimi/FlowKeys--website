
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { TestStatus, TestStats, WordState, CharState } from '../types';

interface TypingEngineProps {
  words: string;
  duration: number;
  onFinish: (stats: TestStats) => void;
  onStart: () => void;
  status: TestStatus;
  onReset: () => void;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({ 
  words, 
  duration, 
  onFinish, 
  onStart, 
  status,
  onReset 
}) => {
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentTyped, setCurrentTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isFocused, setIsFocused] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialWords = words.split(' ').map(word => ({
      original: word,
      typed: '',
      isCorrect: false,
      chars: word.split('').map(char => ({ char, status: 'pending' as const }))
    }));
    setWordStates(initialWords);
    setCurrentWordIndex(0);
    setCurrentTyped('');
    setTimeLeft(duration);
  }, [words, duration]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
    setIsFocused(true);
  }, []);

  useEffect(() => {
    focusInput();
    const handleGlobalClick = () => focusInput();
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [focusInput]);

  const calculateStats = useCallback(() => {
    let correctChars = 0;
    let incorrectChars = 0;
    let missedChars = 0;

    wordStates.forEach((word, wIdx) => {
      if (wIdx > currentWordIndex) return;
      const target = word.original;
      const typed = wIdx === currentWordIndex ? currentTyped : word.typed;
      for (let i = 0; i < Math.max(target.length, typed.length); i++) {
        if (i < typed.length) {
          if (typed[i] === target[i]) correctChars++;
          else incorrectChars++;
        } else if (wIdx < currentWordIndex) missedChars++;
      }
      if (wIdx < currentWordIndex) correctChars++;
    });

    const timeElapsed = duration - timeLeft;
    const minutes = timeElapsed / 60 || 1/60;
    const wpm = Math.round((correctChars / 5) / minutes);
    const accuracy = Math.round((correctChars / (correctChars + incorrectChars + missedChars)) * 100) || 0;
    return { wpm, accuracy, correctChars, incorrectChars, missedChars };
  }, [wordStates, currentWordIndex, currentTyped, duration, timeLeft]);

  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const stats = calculateStats();
    onFinish({ ...stats, time: duration });
  }, [calculateStats, duration, onFinish]);

  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === 'running') {
      finishTest();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, timeLeft, finishTest]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    if (status === 'idle') onStart();
    if (e.key === ' ') {
      e.preventDefault();
      if (currentTyped.length === 0) return;
      setWordStates(prev => {
        const next = [...prev];
        const word = next[currentWordIndex];
        word.typed = currentTyped;
        word.isCorrect = currentTyped === word.original;
        return next;
      });
      if (currentWordIndex === wordStates.length - 1) finishTest();
      else {
        setCurrentWordIndex(prev => prev + 1);
        setCurrentTyped('');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    const val = e.target.value;
    if (val.endsWith(' ')) return;
    setCurrentTyped(val);
  };

  useEffect(() => {
    const activeWordEl = wordsRef.current?.querySelector('.word-active');
    if (!activeWordEl || !caretRef.current) return;
    const charEls = activeWordEl.querySelectorAll('.char');
    const activeCharEl = charEls[currentTyped.length] || activeWordEl.querySelector('.char-last');
    if (activeCharEl) {
      const rect = (activeCharEl as HTMLElement).getBoundingClientRect();
      const parentRect = wordsRef.current!.getBoundingClientRect();
      let left = rect.left - parentRect.left;
      if (currentTyped.length >= activeWordEl.querySelectorAll('.char').length) {
         left = rect.right - parentRect.left;
      }
      caretRef.current.style.transform = `translate3d(${left}px, ${rect.top - parentRect.top}px, 0)`;
    }
  }, [currentTyped, currentWordIndex, wordStates]);

  const liveStats = useMemo(() => calculateStats(), [calculateStats]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex items-end justify-between mb-10 px-4">
        <div className="flex gap-16">
          <div className="flex flex-col">
             <span className="text-6xl font-black mono text-slate-900 dark:text-white tabular-nums tracking-tighter">{timeLeft}</span>
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mt-2">Time Left</span>
          </div>
          {status === 'running' && (
            <>
              <div className="flex flex-col animate-in fade-in slide-in-from-left-4">
                <span className="text-6xl font-black mono text-sky-600 dark:text-cyan-400 tabular-nums tracking-tighter">{liveStats.wpm}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mt-2">Current WPM</span>
              </div>
              <div className="flex flex-col animate-in fade-in slide-in-from-left-8">
                <span className="text-6xl font-black mono text-slate-900 dark:text-white tabular-nums tracking-tighter opacity-40">{liveStats.accuracy}%</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mt-2">Accuracy</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative w-full glass p-12 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[220px]">
        <input
          ref={inputRef}
          type="text"
          value={currentTyped}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />

        {!isFocused && (
          <div className="absolute inset-0 z-30 bg-white/60 dark:bg-black/60 backdrop-blur-[4px] flex items-center justify-center transition-all duration-500">
            <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 bg-sky-500 dark:bg-cyan-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                 <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                 </svg>
               </div>
               <p className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-[0.3em]">Click to Resume Focus</p>
            </div>
          </div>
        )}

        <div 
          ref={wordsRef}
          className={`relative mono text-3xl leading-[1.8] select-none transition-all duration-500 ${!isFocused ? 'opacity-20' : 'opacity-100'}`}
        >
          <div 
            ref={caretRef}
            className="absolute top-0 left-0 w-[3px] h-[1.3em] bg-sky-500 dark:bg-cyan-400 rounded-full transition-transform duration-100 ease-out z-10 shadow-lg"
          />

          <div className="flex flex-wrap gap-x-[0.6em] gap-y-6">
            {wordStates.map((word, wIdx) => {
              const isActive = wIdx === currentWordIndex;
              const isFinished = wIdx < currentWordIndex;
              
              // Improved visibility logic:
              // Finished words stay fully opaque.
              // Active word is fully opaque and scaled.
              // Upcoming words have 60% opacity (increased from 20%) to be clearly visible.
              const opacityClass = isActive ? 'opacity-100 scale-[1.05]' : isFinished ? 'opacity-100' : 'opacity-60';

              return (
                <div key={wIdx} className={`word relative inline-flex transition-all duration-300 ${isActive ? 'word-active' : ''} ${opacityClass}`}>
                  {word.original.split('').map((char, cIdx) => {
                    let status: 'pending' | 'correct' | 'incorrect' | 'missed' = 'pending';
                    if (isFinished) {
                      const typedChar = word.typed[cIdx];
                      if (!typedChar) status = 'missed';
                      else status = typedChar === char ? 'correct' : 'incorrect';
                    } else if (isActive) {
                      const typedChar = currentTyped[cIdx];
                      if (typedChar) status = typedChar === char ? 'correct' : 'incorrect';
                    }

                    // Define character colors for better contrast
                    let charColorClass = 'text-slate-400 dark:text-slate-500'; // Default pending color
                    if (status === 'correct') {
                      charColorClass = 'text-slate-900 dark:text-white font-bold';
                    } else if (status === 'incorrect') {
                      charColorClass = 'text-red-500 bg-red-500/10 underline decoration-red-500/50';
                    } else if (status === 'missed') {
                      charColorClass = 'text-red-900 opacity-50 dark:opacity-30';
                    }

                    return (
                      <span key={cIdx} className={`char transition-colors duration-150 ${charColorClass} ${cIdx === word.original.length - 1 ? 'char-last' : ''}`}>
                        {char}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-16 group">
        <button onClick={onReset} className="flex items-center gap-3 px-10 py-4 glass hover:bg-slate-900/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl font-bold transition-all active:scale-95">
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="uppercase tracking-widest text-xs">Reset Environment</span>
        </button>
      </div>
    </div>
  );
};
