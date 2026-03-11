'use client';

import { useCallback, useRef, useState } from 'react';
import CrosswordGrid, { type CrosswordGridImperative } from './CrosswordGrid';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle2, Eye } from 'lucide-react';
import type { LibraryFormat, LibraryClue } from '../utils/transformCrosswordData';

type ClueGroupProps = {
  title: string;
  entries: Record<string, LibraryClue>;
  groupKey: 'row' | 'col';
  labelPrefix: string;
  direction: 'across' | 'down';
  onClueClick: (row: number, col: number, dir: 'across' | 'down') => void;
};

function ClueGroup({ title, entries, groupKey, labelPrefix, direction, onClueClick }: ClueGroupProps) {
  const otherKey = groupKey === 'row' ? 'col' : 'row';
  const groups = new Map<number, Array<{ num: string; clue: string; position: number; row: number; col: number }>>();
  for (const [num, entry] of Object.entries(entries)) {
    const coord = entry[groupKey] + 1;
    if (!groups.has(coord)) groups.set(coord, []);
    groups.get(coord)!.push({ num, clue: entry.clue, position: entry[otherKey] + 1, row: entry.row, col: entry.col });
  }
  const sorted = [...groups.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <div>
      <h3 className="font-semibold text-slate-700 mb-3">{title}</h3>
      <div className="space-y-3">
        {sorted.map(([coord, clues]) => (
          <div key={coord}>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {labelPrefix} {coord}
            </span>
            <ul className="mt-0.5 space-y-0.5">
              {clues.sort((a, b) => a.position - b.position).map(({ num, clue, position, row, col }) => (
                <li
                  key={num}
                  className="text-sm text-slate-600 flex items-baseline gap-2 pl-2 cursor-pointer hover:text-emerald-700 hover:bg-emerald-50 rounded px-1 -mx-1 transition-colors"
                  onClick={() => onClueClick(row, col, direction)}
                >
                  <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-slate-500 text-xs font-semibold">
                    {position}
                  </span>
                  {clue}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  data: LibraryFormat;
  crosswordId: string;
  solutionAvailable: boolean;
  rows: number;
  cols: number;
};

export default function CrosswordPlayer({ data, crosswordId, solutionAvailable, rows, cols }: Props) {
  const gridRef = useRef<CrosswordGridImperative>(null);
  const [isComplete, setIsComplete] = useState(false);
  const storageKey = `crossword-${crosswordId}`;

  const totalClues = Object.keys(data.across).length + Object.keys(data.down).length;

  const handleComplete = useCallback((correct: boolean) => {
    if (correct) setIsComplete(true);
  }, []);

  const handleReset = useCallback(() => {
    gridRef.current?.reset();
    setIsComplete(false);
  }, []);

  const handleShowSolution = useCallback(() => {
    gridRef.current?.fillAllAnswers();
  }, []);

  const handleClueClick = useCallback((row: number, col: number, dir: 'across' | 'down') => {
    gridRef.current?.focusWord(row, col, dir);
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

      <CrosswordGrid
        ref={gridRef}
        data={data}
        rows={rows}
        cols={cols}
        storageKey={storageKey}
        onComplete={handleComplete}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
        <ClueGroup
          title="Lignes"
          entries={data.across}
          groupKey="row"
          labelPrefix="Ligne"
          direction="across"
          onClueClick={handleClueClick}
        />
        <ClueGroup
          title="Colonnes"
          entries={data.down}
          groupKey="col"
          labelPrefix="Colonne"
          direction="down"
          onClueClick={handleClueClick}
        />
      </div>
    </div>
  );
}
