
export type TestStatus = 'idle' | 'running' | 'finished';

export interface CharState {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'missed' | 'extra';
}

export interface WordState {
  original: string;
  typed: string;
  isCorrect: boolean;
  chars: CharState[];
}

export interface TestStats {
  wpm: number;
  accuracy: number;
  time: number;
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
}
