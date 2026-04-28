'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import CrosswordGrid, { type CrosswordGridImperative, type FocusChangeState } from './CrosswordGrid';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle2, BookOpen, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import type { LibraryFormat, LibraryClue } from '../utils/transformCrosswordData';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';

const clueComponents: PortableTextComponents = {
  block: { normal: ({ children }) => <>{children}</> },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  hardBreak: () => null,
};

function filterEmptyBlocks(blocks: { children?: Array<{ text?: string }> }[]): { children?: Array<{ text?: string }> }[] {
  return blocks.filter(b => !b.children || b.children.some(c => c.text?.replace(/[ \s]/g, '') !== ''));
}

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
      <ul className="space-y-1.5">
        {sorted.map(([num, entry]) => {
          const isActive = activeNum !== null && Number(num) === activeNum;
          return (
            <li
              key={num}
              ref={isActive ? activeRef : null}
              className={`text-sm flex items-start gap-2 cursor-pointer rounded px-1 -mx-1 transition-colors ${
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
              <span className="flex-1"><PortableText value={filterEmptyBlocks(entry.clue as { children?: Array<{ text?: string }> }[]) as PortableTextBlock[]} components={clueComponents} /></span>
              {entry.termSlug && (
                <Link
                  href={`/glossaire/${entry.termSlug}`}
                  target="_blank"
                  onClick={e => e.stopPropagation()}
                  className="shrink-0 self-center flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-full transition-colors no-underline visited:text-emerald-600"
                  title={`Voir la définition de « ${entry.termSlug} »`}
                >
                  <BookOpen className="h-3 w-3" />
                  <span>Glossaire</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type PortableTextBlock = { _type: string; _key: string; [key: string]: unknown };

type Props = {
  data: LibraryFormat;
  crosswordId: string;
  rows: number;
  cols: number;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: PortableTextBlock[];
};


export default function CrosswordPlayer({ data, crosswordId, rows, cols, imageUrl, imageAlt, imageCaption }: Props) {
  const gridRef = useRef<CrosswordGridImperative>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [focusState, setFocusState] = useState<FocusChangeState>(null);
  const storageKey = `crossword-${crosswordId}`;

  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());

  const [showCaption, setShowCaption] = useState(false);

  const [revealedWords, setRevealedWords] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      return new Set(JSON.parse(localStorage.getItem(storageKey + '-revealed-words') || '[]'));
    } catch { return new Set(); }
  });

  const totalClues = Object.keys(data.across).length + Object.keys(data.down).length;

  const wordSequence = useMemo(() => {
    const words: Array<{ num: number; dir: 'across' | 'down'; row: number; col: number }> = [];
    for (const [num, entry] of Object.entries(data.across))
      words.push({ num: Number(num), dir: 'across', row: entry.row, col: entry.col });
    for (const [num, entry] of Object.entries(data.down))
      words.push({ num: Number(num), dir: 'down', row: entry.row, col: entry.col });
    return words.sort((a, b) => a.num - b.num || (a.dir === 'across' ? -1 : 1));
  }, [data]);

  const navigateWord = useCallback((delta: 1 | -1) => {
    if (!wordSequence.length) return;
    const currentIndex = focusState
      ? wordSequence.findIndex(w => w.num === focusState.wordNum && w.dir === focusState.dir)
      : -1;
    const nextIndex = (currentIndex + delta + wordSequence.length) % wordSequence.length;
    const word = wordSequence[nextIndex];
    gridRef.current?.focusFirstEmptyInWord(word.row, word.col, word.dir);
  }, [wordSequence, focusState]);

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
    if (correct) {
      setIsComplete(true);
      try { localStorage.setItem(storageKey + '-complete', '1'); } catch { /* ignore */ }
    }
  }, [storageKey]);

  const handleReset = useCallback(() => {
    gridRef.current?.reset();
    setIsComplete(false);
    setFocusState(null);
    setRevealedWords(new Set());
    setShowCaption(false);
    try { localStorage.removeItem(storageKey + '-revealed-words'); } catch { /* ignore */ }
  }, [storageKey]);

  const handleClueClick = useCallback((row: number, col: number, dir: 'across' | 'down') => {
    gridRef.current?.focusWord(row, col, dir);
  }, []);

  const handleFocusChange = useCallback((state: FocusChangeState) => {
    setFocusState(state);
  }, []);

  const handleWordComplete = useCallback(() => {
    navigateWord(1);
  }, [navigateWord]);

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
          <li>• Certains indices sont accompagnés d'un badge <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full"><BookOpen className="h-3 w-3 inline" />Glossaire</span> — cliquez dessus pour consulter un terme en lien avec l'indice.</li>
        </ul>
      </details>

      <div className="min-h-[46px] border border-slate-200 rounded-lg flex items-center bg-white overflow-hidden">
        <button
          onClick={() => navigateWord(-1)}
          className="shrink-0 px-2 self-stretch flex items-center text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors border-r border-slate-200"
          aria-label="Mot précédent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 px-3 py-2.5 flex items-center gap-3">
        {activeClue ? (
          <>
            <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">
              {activeClue.num}
            </span>
            <span className="text-xs font-medium text-slate-400 shrink-0">
              {activeClue.dir === 'across' ? '→' : '↓'}
            </span>
            <span className="text-sm text-slate-700 flex-1 leading-snug"><PortableText value={activeClue.clue} components={clueComponents} /></span>
            {!revealedWords.has(`${activeClue.num}-${activeClue.dir}`) &&
             !completedWords.has(`${activeClue.num}-${activeClue.dir}`) && (
              <button
                onClick={() => {
                  const entry = (activeClue.dir === 'across' ? data.across : data.down)[String(activeClue.num)];
                  if (entry) {
                    gridRef.current?.revealWord(entry.row, entry.col, activeClue.dir);
                    setRevealedWords(prev => {
                      const next = new Set(prev);
                      next.add(`${activeClue.num}-${activeClue.dir}`);
                      try { localStorage.setItem(storageKey + '-revealed-words', JSON.stringify([...next])); } catch { /* ignore */ }
                      return next;
                    });
                  }
                }}
                className="shrink-0 flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full transition-colors"
                title="Révéler le mot"
              >
                <Lightbulb className="h-3 w-3" />
                <span>Révéler</span>
              </button>
            )}
            {activeClue.termSlug && (
              <Link
                href={`/glossaire/${activeClue.termSlug}`}
                target="_blank"
                className="shrink-0 flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-full transition-colors no-underline visited:text-emerald-600"
                title={`Voir la définition de « ${activeClue.termSlug} »`}
              >
                <BookOpen className="h-3 w-3" />
                <span>Glossaire</span>
              </Link>
            )}
          </>
        ) : (
          <span className="text-sm text-slate-400 italic">Cliquez sur une case pour voir l'indice…</span>
        )}
        </div>
        <button
          onClick={() => navigateWord(1)}
          className="shrink-0 px-2 self-stretch flex items-center text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors border-l border-slate-200"
          aria-label="Mot suivant"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <CrosswordGrid
            ref={gridRef}
            data={data}
            rows={rows}
            cols={cols}
            storageKey={storageKey}

            onComplete={handleComplete}
            onFocusChange={handleFocusChange}
            onWordComplete={handleWordComplete}
            onCompletedWordsChange={setCompletedWords}
          />
        </div>
        {imageUrl && (
          <div
            className="w-full lg:w-80 shrink-0 lg:mt-[20px] self-start"
            style={{ maxWidth: cols * 36 + 24 }}
          >
            <div className="relative w-full rounded-lg overflow-hidden border border-slate-200">
              <Image src={imageUrl} alt={imageAlt ?? ''} width={320} height={320} className="w-full h-auto object-cover" unoptimized />
            </div>
            {imageCaption && imageCaption.length > 0 && !showCaption && !isComplete && (
              <button
                onClick={() => setShowCaption(true)}
                className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-full transition-colors"
              >
                <Lightbulb className="h-3 w-3" />
                Révéler la légende
              </button>
            )}
            {(showCaption || isComplete) && imageCaption && imageCaption.length > 0 && (
              <p className="mt-1.5 text-xs text-slate-500 leading-snug">
                <PortableText value={imageCaption} components={clueComponents} />
              </p>
            )}
          </div>
        )}
      </div>

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
