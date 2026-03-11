'use client';

import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { CrosswordProviderImperative } from '@jaredreisinger/react-crossword';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle2, Eye } from 'lucide-react';
import type { LibraryFormat } from '../utils/transformCrosswordData';

const Crossword = dynamic(
  () => import('@jaredreisinger/react-crossword').then(m => m.default),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Chargement de la grille…</div> }
);

type Props = {
  data: LibraryFormat;
  crosswordId: string;
  solutionAvailable: boolean;
};

export default function CrosswordPlayer({ data, crosswordId, solutionAvailable }: Props) {
  const crosswordRef = useRef<CrosswordProviderImperative>(null);
  const [isComplete, setIsComplete] = useState(false);
  const skipStorageRef = useRef(false);
  const storageKey = `crossword-${crosswordId}`;

  const totalClues = Object.keys(data.across).length + Object.keys(data.down).length;

  const handleCrosswordComplete = useCallback((correct: boolean) => {
    if (correct) setIsComplete(true);
  }, []);

  const handleCellChange = useCallback((row: number, col: number, char: string) => {
    if (skipStorageRef.current) return;
    try {
      const current = JSON.parse(localStorage.getItem(storageKey) || '{}');
      current[`${row}-${col}`] = char;
      localStorage.setItem(storageKey, JSON.stringify(current));
    } catch {
      // ignore storage errors
    }
  }, [storageKey]);

  const handleReset = useCallback(() => {
    crosswordRef.current?.reset();
    setIsComplete(false);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const handleShowSolution = useCallback(() => {
    skipStorageRef.current = true;
    crosswordRef.current?.fillAllAnswers();
    // Allow a tick for all onCellChange events to fire before re-enabling storage writes
    setTimeout(() => { skipStorageRef.current = false; }, 0);
  }, []);

  return (
    <div className="space-y-4">
      {isComplete && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-800">Félicitations !</p>
            <p className="text-sm text-emerald-700">Vous avez complété ce mot croisé.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 bg-slate-50 rounded-lg px-4 py-3">
        <span className="text-sm text-slate-600">{totalClues} indices</span>
        <div className="flex gap-2 flex-wrap justify-end">
          {solutionAvailable && (
            <Button variant="outline" size="sm" onClick={handleShowSolution} className="text-xs gap-1">
              <Eye className="h-3 w-3" />
              Voir la solution
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs gap-1">
            <RotateCcw className="h-3 w-3" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <Crossword
        ref={crosswordRef}
        data={data}
        onCrosswordComplete={handleCrosswordComplete}
        onCellChange={handleCellChange}
        theme={{
          gridBackground: '#fff',
          cellBackground: '#fff',
          cellBorder: '#cbd5e1',
          textColor: '#1e293b',
          numberColor: '#64748b',
          focusBackground: '#d1fae5',
          highlightBackground: '#f1f5f9',
        }}
      />
    </div>
  );
}
