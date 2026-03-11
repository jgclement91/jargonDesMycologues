'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import CrosswordGrid, { type CrosswordGridImperative, type FocusChangeState } from './CrosswordGrid';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle2, Eye, BookOpen } from 'lucide-react';
import type { LibraryFormat, LibraryClue } from '../utils/transformCrosswordData';

type ClueGroupProps = {
  title: string;
  entries: Record<string, LibraryClue>;
  direction: 'across' | 'down';
  activeNum: number | null;
  onClueClick: (row: number, col: number, dir: 'across' | 'down') => void;
};

function ClueGroup({ title, entries, direction, activeNum, onClueClick }: ClueGroupProps) {
  const activeRef = useRef<HTMLLIElement>(null);

  const sorted = useMemo(
    () => Object.entries(entries).sort(([a], [b]) => Number(a) - Number(b)),
    [entries]
  );

  return (
    <div>
      <h3 className="font-semibold text-slate-700 mb-3">{title}</h3>
      <ul className="space-y-0.5">
        {sorted.map(([num, entry]) => {
          const isActive = activeNum !== null && Number(num) === activeNum;
          return (
            <li
              key={num}
              ref={isActive ? activeRef : null}
              className={`text-sm flex items-baseline gap-2 cursor-pointer rounded px-1 -mx-1 transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
              onClick={() => onClueClick(entry.row, entry.col, direction)}
            >
              <span className={`shrink-0 inline-flex items-center justify-center w-5 h-5 rounded text-xs font-semibold ${
                isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {num}
              </span>
              <span className="flex-1 py-0.5">{entry.clue}</span>
              {entry.termSlug && (
                <Link
                  href={`/glossaire/${entry.termSlug}`}
                  target="_blank"
                  onClick={e => e.stopPropagation()}
                  className="shrink-0 self-center text-slate-300 hover:text-emerald-600 transition-colors"
                  title={`Voir la définition de « ${entry.termSlug} »`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
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
  const [focusState, setFocusState] = useState<FocusChangeState>(null);
  const storageKey = `crossword-${crosswordId}`;

  const totalClues = Object.keys(data.across).length + Object.keys(data.down).length;

  const activeClue = useMemo(() => {
    if (!focusState?.wordNum) return null;
    const entries = focusState.dir === 'across' ? data.across : data.down;
    const entry = entries[String(focusState.wordNum)];
    if (!entry) return null;
    return { dir: focusState.dir, num: focusState.wordNum, clue: entry.clue, termSlug: entry.termSlug };
  }, [focusState, data]);

  const activeAcrossNum = focusState?.dir === 'across' ? (focusState.wordNum ?? null) : null;
  const activeDownNum = focusState?.dir === 'down' ? (focusState.wordNum ?? null) : null;

  const handleComplete = useCallback((correct: boolean) => {
    if (correct) setIsComplete(true);
  }, []);

  const handleReset = useCallback(() => {
    gridRef.current?.reset();
    setIsComplete(false);
    setFocusState(null);
  }, []);

  const handleShowSolution = useCallback(() => {
    gridRef.current?.fillAllAnswers();
  }, []);

  const handleClueClick = useCallback((row: number, col: number, dir: 'across' | 'down') => {
    gridRef.current?.focusWord(row, col, dir);
  }, []);

  const handleFocusChange = useCallback((state: FocusChangeState) => {
    setFocusState(state);
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
        <span className="text-sm text-slate-600">{totalClues} mots</span>
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

      <details className="group text-sm text-slate-500 border border-slate-200 rounded-lg overflow-hidden">
        <summary className="flex items-center gap-2 px-4 py-2.5 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 transition-colors list-none">
          <span className="text-base leading-none">💡</span>
          <span className="font-medium text-slate-600">Comment jouer ?</span>
          <span className="ml-auto text-xs text-slate-400 group-open:hidden">Afficher</span>
          <span className="ml-auto text-xs text-slate-400 hidden group-open:inline">Masquer</span>
        </summary>
        <ul className="px-4 py-3 space-y-1.5 text-slate-600 bg-white">
          <li>• Cliquez sur une case blanche pour sélectionner le mot qui la traverse. Les cases du mot se colorent en bleu.</li>
          <li>• Si deux mots se croisent sur cette case, cliquez une deuxième fois pour basculer entre le mot horizontal et le mot vertical.</li>
          <li>• Tapez vos lettres au clavier — le curseur avance automatiquement jusqu'à la fin du mot.</li>
          <li>• Utilisez <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono">←</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono">→</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono">↓</kbd> pour déplacer le curseur, et <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono">⌫</kbd> pour effacer une lettre.</li>
          <li>• Cliquez sur un indice dans la liste ci-dessous pour sélectionner le mot correspondant dans la grille.</li>
        </ul>
      </details>

      <div className="min-h-[46px] border border-slate-200 rounded-lg px-4 py-2.5 flex items-center gap-3 bg-white">
        {activeClue ? (
          <>
            <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">
              {activeClue.num}
            </span>
            <span className="text-xs font-medium text-slate-400 shrink-0">
              {activeClue.dir === 'across' ? '→' : '↓'}
            </span>
            <span className="text-sm text-slate-700 flex-1 leading-snug">{activeClue.clue}</span>
            {activeClue.termSlug && (
              <Link
                href={`/glossaire/${activeClue.termSlug}`}
                target="_blank"
                className="shrink-0 text-slate-300 hover:text-emerald-600 transition-colors"
                title={`Voir la définition de « ${activeClue.termSlug} »`}
              >
                <BookOpen className="h-3.5 w-3.5" />
              </Link>
            )}
          </>
        ) : (
          <span className="text-sm text-slate-400 italic">Cliquez sur une case pour voir l'indice…</span>
        )}
      </div>

      <CrosswordGrid
        ref={gridRef}
        data={data}
        rows={rows}
        cols={cols}
        storageKey={storageKey}
        onComplete={handleComplete}
        onFocusChange={handleFocusChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
        <ClueGroup
          title="Horizontaux"
          entries={data.across}
          direction="across"
          activeNum={activeAcrossNum}
          onClueClick={handleClueClick}
        />
        <ClueGroup
          title="Verticaux"
          entries={data.down}
          direction="down"
          activeNum={activeDownNum}
          onClueClick={handleClueClick}
        />
      </div>
    </div>
  );
}
