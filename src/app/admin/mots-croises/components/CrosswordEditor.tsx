'use client';

import { useState, useMemo, useCallback, useTransition, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';
import {
  computeSlots,
  computeCellNumbers,
  getCellsForSlot,
  buildEmptyGrid,
  toggleCell,
} from './gridUtils';
import WordSlotPanel from './WordSlotPanel';
import { saveCrossword } from '../../actions/crossword';

type SlotFormData = {
  answer: string;
  clue: string;
  termId?: string;
  termSlug?: string;
};

type Props = {
  rows: number;
  cols: number;
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  availableFrom: string;
  solutionFrom: string;
};

const STORAGE_KEY = 'crossword-editor-draft';

function loadDraft(slug: string, rows: number, cols: number): { grid: boolean[][]; slotData: Record<string, SlotFormData> } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.slug !== slug || parsed.rows !== rows || parsed.cols !== cols) return null;
    return { grid: parsed.grid, slotData: parsed.slotData };
  } catch {
    return null;
  }
}

function saveDraft(slug: string, rows: number, cols: number, grid: boolean[][], slotData: Record<string, SlotFormData>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ slug, rows, cols, grid, slotData }));
  } catch {
    // ignore storage errors
  }
}

export default function CrosswordEditor({ rows, cols, title, slug, difficulty, description, availableFrom, solutionFrom }: Props) {
  const [grid, setGrid] = useState<boolean[][]>(() => buildEmptyGrid(rows, cols));
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [slotData, setSlotData] = useState<Record<string, SlotFormData>>({});
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const isFirstPersistRef = useRef(true);

  // Restore draft on mount
  useEffect(() => {
    const draft = loadDraft(slug, rows, cols);
    if (draft) {
      setGrid(draft.grid);
      setSlotData(draft.slotData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change — skip the very first run to avoid overwriting
  // the draft before the restore effect has had a chance to apply it
  useEffect(() => {
    if (isFirstPersistRef.current) {
      isFirstPersistRef.current = false;
      return;
    }
    saveDraft(slug, rows, cols, grid, slotData);
  }, [slug, rows, cols, grid, slotData]);

  const slots = useMemo(() => computeSlots(grid, rows, cols), [grid, rows, cols]);
  const cellNumbers = useMemo(() => computeCellNumbers(slots), [slots]);
  const selectedSlot = slots.find(s => s.id === selectedSlotId) ?? null;

  const highlightedCells = useMemo(() => {
    if (!selectedSlot) return new Set<string>();
    return new Set(getCellsForSlot(selectedSlot).map(c => `${c.row}-${c.col}`));
  }, [selectedSlot]);

  const cellLetters = useMemo(() => {
    const letters: Record<string, { letter: string; conflict: boolean }> = {};
    for (const slot of slots) {
      const answer = slotData[slot.id]?.answer ?? '';
      getCellsForSlot(slot).forEach((cell, i) => {
        const key = `${cell.row}-${cell.col}`;
        const letter = answer[i] ?? '';
        if (!letter.trim()) return;
        if (letters[key]?.letter && letters[key].letter !== letter) {
          letters[key] = { letter: letters[key].letter, conflict: true };
        } else {
          letters[key] = { letter, conflict: false };
        }
      });
    }
    return letters;
  }, [slots, slotData]);

  // Merged answer for every slot: own letters + letters from crossing slots
  const mergedAnswers = useMemo(() => {
    const result: Record<string, string> = {};
    for (const slot of slots) {
      const cells = getCellsForSlot(slot);
      const own = slotData[slot.id]?.answer ?? '';
      result[slot.id] = cells
        .map((cell, i) => {
          const ownLetter = own[i];
          if (ownLetter?.trim()) return ownLetter;
          return cellLetters[`${cell.row}-${cell.col}`]?.letter?.trim() || ' ';
        })
        .join('')
        .trimEnd();
    }
    return result;
  }, [slots, slotData, cellLetters]);

  // When a slot is selected, pre-fill its answer with letters from crossing slots
  useEffect(() => {
    if (!selectedSlot) return;
    const merged = mergedAnswers[selectedSlot.id] ?? '';
    const existing = slotData[selectedSlot.id]?.answer ?? '';
    if (merged !== existing) {
      setSlotData(prev => ({
        ...prev,
        [selectedSlot.id]: { ...(prev[selectedSlot.id] ?? { clue: '' }), answer: merged },
      }));
    }
  // Only run on slot change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlotId]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (grid[row][col]) {
      setGrid(prev => toggleCell(prev, row, col));
      setSelectedSlotId(null);
      return;
    }

    const cellSlots = slots.filter(s =>
      getCellsForSlot(s).some(c => c.row === row && c.col === col)
    );

    if (cellSlots.length === 0) {
      setGrid(prev => toggleCell(prev, row, col));
      setSelectedSlotId(null);
      return;
    }

    const currentIndex = cellSlots.findIndex(s => s.id === selectedSlotId);
    if (currentIndex !== -1) {
      const next = cellSlots[(currentIndex + 1) % cellSlots.length];
      setSelectedSlotId(next.id);
    } else {
      const preferred = cellSlots.find(s => s.direction === 'down') ?? cellSlots[0];
      setSelectedSlotId(preferred.id);
    }
  }, [grid, slots, selectedSlotId]);

  const handleSlotDataChange = useCallback((data: SlotFormData) => {
    if (!selectedSlotId) return;
    setSlotData(prev => ({ ...prev, [selectedSlotId]: data }));
  }, [selectedSlotId]);

  const validation = useMemo(() => {
    const errors: string[] = [];
    for (const slot of slots) {
      const data = slotData[slot.id];
      if (!data?.answer || data.answer.length !== slot.length || data.answer.includes(' ')) {
        errors.push(`${slot.number} ${slot.direction === 'across' ? 'H' : 'V'}: réponse manquante ou incorrecte`);
      }
      if (!data?.clue) {
        errors.push(`${slot.number} ${slot.direction === 'across' ? 'H' : 'V'}: indice manquant`);
      }
    }
    return errors;
  }, [slots, slotData]);

  const handleSave = () => {
    if (validation.length > 0) {
      setSaveError('Corrigez les erreurs avant de sauvegarder.');
      return;
    }
    setSaveError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('crossword-editor-setup');
    } catch { /* ignore */ }
    const mapSlots = (direction: 'across' | 'down') =>
      slots.filter(s => s.direction === direction).map(s => ({
        number: s.number,
        row: s.row,
        col: s.col,
        answer: slotData[s.id]?.answer ?? '',
        clue: slotData[s.id]?.clue ?? '',
        termId: slotData[s.id]?.termId,
      }));
    startTransition(() => {
      saveCrossword({ title, slug, difficulty, description, availableFrom, solutionFrom, gridData: { rows, cols, across: mapSlots('across'), down: mapSlots('down') } });
    });
  };

  const handleReset = () => {
    setGrid(buildEmptyGrid(rows, cols));
    setSlotData({});
    setSelectedSlotId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('crossword-editor-setup');
    } catch { /* ignore */ }
  };

  const cellSizePx = Math.min(36, Math.floor(560 / Math.max(rows, cols)));

  return (
    <div className="flex gap-6 flex-col lg:flex-row">
      <div className="flex flex-col gap-4">
        <div
          className="border border-slate-300 rounded overflow-hidden select-none"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cellSizePx}px)` }}
        >
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: cols }, (_, c) => {
              const key = `${r}-${c}`;
              const isBlocked = grid[r][c];
              const isHighlighted = highlightedCells.has(key);
              const nums = cellNumbers[key];
              const letterData = cellLetters[key];
              const cellLabel = nums
                ? nums.across !== undefined && nums.down !== undefined
                  ? `${nums.across}/${nums.down}`
                  : String(nums.across ?? nums.down)
                : null;

              return (
                <div
                  key={key}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (!grid[r][c]) { setGrid(prev => toggleCell(prev, r, c)); setSelectedSlotId(null); }
                  }}
                  className={[
                    'relative border border-slate-300 cursor-pointer flex items-center justify-center',
                    isBlocked ? 'bg-slate-800' : isHighlighted ? 'bg-blue-100' : 'bg-white hover:bg-slate-50',
                  ].join(' ')}
                  style={{ width: cellSizePx, height: cellSizePx }}
                >
                  {!isBlocked && cellLabel && (
                    <span
                      className="absolute top-0 left-0.5 text-slate-500 leading-none"
                      style={{ fontSize: Math.max(6, cellSizePx * 0.24) }}
                    >
                      {cellLabel}
                    </span>
                  )}
                  {!isBlocked && letterData?.letter?.trim() && (
                    <span
                      className={['font-bold uppercase leading-none', letterData.conflict ? 'text-red-600' : 'text-slate-700'].join(' ')}
                      style={{ fontSize: cellSizePx * 0.45 }}
                    >
                      {letterData.letter}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <p className="text-xs text-slate-500">
          Clic gauche = sélectionner (recliquer pour changer de direction) · Clic droit = basculer noir/blanc
        </p>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Réinitialiser la grille
          </Button>
          <span className="text-sm text-slate-500">{slots.length} mots détectés</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:w-80">
        <div className="border border-slate-200 rounded-lg min-h-64 flex flex-col">
          <div className="border-b border-slate-200 px-4 py-2 bg-slate-50 rounded-t-lg">
            <h3 className="text-sm font-medium text-slate-700">Mot sélectionné</h3>
          </div>
          <div className="flex-1">
            <WordSlotPanel
              slot={selectedSlot}
              data={slotData[selectedSlotId ?? ''] ?? { answer: '', clue: '' }}
              onChange={handleSlotDataChange}
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-2 bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700">Liste des mots</h3>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {slots.length === 0 ? (
              <p className="text-xs text-slate-400 p-3">Aucun mot détecté. Ajoutez des cases noires.</p>
            ) : (
              <>
                {(['across', 'down'] as const).map(dir => {
                  const dirSlots = slots.filter(s => s.direction === dir);
                  if (dirSlots.length === 0) return null;
                  return (
                    <div key={dir}>
                      <div className="px-3 py-1 bg-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {dir === 'across' ? 'Horizontal' : 'Vertical'}
                      </div>
                      {dirSlots.map(slot => {
                        const data = slotData[slot.id];
                        const merged = mergedAnswers[slot.id] ?? '';
                        const isComplete = merged.length === slot.length && !merged.includes(' ') && !!data?.clue;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={[
                              'w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 border-t border-slate-100',
                              selectedSlotId === slot.id ? 'bg-blue-50' : '',
                            ].join(' ')}
                          >
                            <span className={['w-2 h-2 rounded-full shrink-0', isComplete ? 'bg-emerald-500' : 'bg-slate-300'].join(' ')} />
                            <span className="font-medium text-slate-700 shrink-0">
                              {slot.number}{dir === 'across' ? 'H' : 'V'}
                            </span>
                            <span className="text-slate-400 truncate font-mono">{merged || '—'}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {saveError && <p className="text-sm text-red-600">{saveError}</p>}
        {validation.length > 0 && (
          <p className="text-xs text-amber-600">{validation.length} mot(s) incomplet(s)</p>
        )}

        <Button
          onClick={handleSave}
          disabled={isPending || slots.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {isPending ? 'Sauvegarde…' : 'Publier le mot croisé'}
        </Button>
      </div>
    </div>
  );
}
