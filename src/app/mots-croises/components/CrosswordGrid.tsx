'use client';

import { forwardRef, Fragment, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { LibraryFormat } from '../utils/transformCrosswordData';

export type CrosswordGridImperative = {
  reset: () => void;
  fillAllAnswers: () => void;
  focusWord: (row: number, col: number, dir: 'across' | 'down') => void;
};

type CellInfo = {
  isBlocked: boolean;
  answer: string;
  acrossNum?: number;
  downNum?: number;
};

type Props = {
  data: LibraryFormat;
  rows: number;
  cols: number;
  storageKey: string;
  onComplete?: (correct: boolean) => void;
};

const CELL = 36;

function buildGrid(data: LibraryFormat, rows: number, cols: number): CellInfo[][] {
  const g: CellInfo[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ isBlocked: true, answer: '' }))
  );

  for (const [num, entry] of Object.entries(data.across)) {
    for (let i = 0; i < entry.answer.length; i++) {
      const cell = g[entry.row][entry.col + i];
      cell.isBlocked = false;
      cell.answer = entry.answer[i];
      cell.acrossNum = Number(num);
    }
  }

  for (const [num, entry] of Object.entries(data.down)) {
    for (let i = 0; i < entry.answer.length; i++) {
      const cell = g[entry.row + i][entry.col];
      cell.isBlocked = false;
      if (!cell.answer) cell.answer = entry.answer[i];
      cell.downNum = Number(num);
    }
  }

  return g;
}

function getWordCells(
  data: LibraryFormat,
  grid: CellInfo[][],
  row: number,
  col: number,
  dir: 'across' | 'down'
): Array<{ row: number; col: number }> {
  const wordNum = dir === 'across' ? grid[row][col].acrossNum : grid[row][col].downNum;
  if (wordNum === undefined) return [];
  const entry = (dir === 'across' ? data.across : data.down)[String(wordNum)];
  if (!entry) return [];
  return dir === 'across'
    ? Array.from({ length: entry.answer.length }, (_, i) => ({ row: entry.row, col: entry.col + i }))
    : Array.from({ length: entry.answer.length }, (_, i) => ({ row: entry.row + i, col: entry.col }));
}

function checkCorrect(grid: CellInfo[][], letters: Record<string, string>): boolean {
  return grid.every((row, r) =>
    row.every((cell, c) =>
      cell.isBlocked || (letters[`${r}-${c}`] ?? '').toUpperCase() === cell.answer.toUpperCase()
    )
  );
}

const CrosswordGrid = forwardRef<CrosswordGridImperative, Props>(function CrosswordGrid(
  { data, rows, cols, storageKey, onComplete },
  ref
) {
  const grid = useMemo(() => buildGrid(data, rows, cols), [data, rows, cols]);

  const [letters, setLetters] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      return {};
    }
  });

  const [focused, setFocused] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const wordCells = useMemo((): Set<string> => {
    if (!focused) return new Set();
    return new Set(
      getWordCells(data, grid, focused.row, focused.col, direction).map(c => `${c.row}-${c.col}`)
    );
  }, [focused, direction, data, grid]);

  useEffect(() => {
    if (Object.keys(letters).length > 0 && checkCorrect(grid, letters)) {
      onCompleteRef.current?.(true);
    }
  }, [letters, grid]);

  const writeLetter = useCallback((row: number, col: number, char: string) => {
    setLetters(prev => {
      const next = { ...prev, [`${row}-${col}`]: char };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [storageKey]);

  const findNext = useCallback((
    row: number,
    col: number,
    dir: 'across' | 'down',
    delta: 1 | -1
  ): { row: number; col: number } | null => {
    let r = row + (dir === 'down' ? delta : 0);
    let c = col + (dir === 'across' ? delta : 0);
    while (r >= 0 && r < rows && c >= 0 && c < cols) {
      if (!grid[r][c].isBlocked) return { row: r, col: c };
      r += dir === 'down' ? delta : 0;
      c += dir === 'across' ? delta : 0;
    }
    return null;
  }, [grid, rows, cols]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (grid[row][col].isBlocked) return;
    if (focused?.row === row && focused?.col === col) {
      const cell = grid[row][col];
      if (cell.acrossNum !== undefined && cell.downNum !== undefined) {
        setDirection(d => d === 'across' ? 'down' : 'across');
      }
    } else {
      const cell = grid[row][col];
      const newDir = cell.acrossNum === undefined ? 'down' : cell.downNum === undefined ? 'across' : direction;
      setFocused({ row, col });
      setDirection(newDir);
    }
    containerRef.current?.focus();
  }, [focused, direction, grid]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!focused) return;
    const { row, col } = focused;

    const moves: Record<string, () => void> = {
      ArrowRight: () => { const n = findNext(row, col, 'across', 1);  if (n) { setFocused(n); setDirection('across'); } },
      ArrowLeft:  () => { const n = findNext(row, col, 'across', -1); if (n) { setFocused(n); setDirection('across'); } },
      ArrowDown:  () => { const n = findNext(row, col, 'down', 1);    if (n) { setFocused(n); setDirection('down'); } },
      ArrowUp:    () => { const n = findNext(row, col, 'down', -1);   if (n) { setFocused(n); setDirection('down'); } },
    };

    if (moves[e.key]) {
      e.preventDefault();
      moves[e.key]();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      writeLetter(row, col, '');
      const prev = findNext(row, col, direction, -1);
      if (prev) setFocused(prev);
    } else if (e.key.length === 1 && /^[a-zA-ZÀ-ÖØ-öø-ÿ]$/.test(e.key)) {
      e.preventDefault();
      writeLetter(row, col, e.key.toUpperCase());
      const next = findNext(row, col, direction, 1);
      if (next) setFocused(next);
    }
  }, [focused, direction, findNext, writeLetter]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setLetters({});
      setFocused(null);
      try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    },
    fillAllAnswers: () => {
      const all: Record<string, string> = {};
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!grid[r][c].isBlocked) all[`${r}-${c}`] = grid[r][c].answer;
        }
      }
      setLetters(all);
    },
    focusWord: (row: number, col: number, dir: 'across' | 'down') => {
      setFocused({ row, col });
      setDirection(dir);
      containerRef.current?.focus();
    },
  }), [grid, rows, cols, storageKey]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="outline-none overflow-auto"
    >
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ width: 24 }} />
            {Array.from({ length: cols }, (_, c) => (
              <th
                key={c}
                style={{ width: CELL, height: 20, fontWeight: 'normal', fontSize: 11 }}
                className="text-slate-400 text-center select-none"
              >
                {c + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r}>
              <td
                style={{ width: 24, height: CELL, fontSize: 11 }}
                className="text-slate-400 text-right pr-1 select-none align-middle"
              >
                {r + 1}
              </td>
              {Array.from({ length: cols }, (_, c) => {
                const cell = grid[r][c];
                const key = `${r}-${c}`;

                if (cell.isBlocked) {
                  return (
                    <td
                      key={key}
                      style={{
                        width: CELL,
                        height: CELL,
                        backgroundColor: '#000',
                        border: '1px solid #000',
                      }}
                    />
                  );
                }

                const isFocused = focused?.row === r && focused?.col === c;
                const isInWord = wordCells.has(key);
                const letter = letters[key] ?? '';
                const bg = isFocused ? '#d1fae5' : isInWord ? '#f1f5f9' : '#fff';

                return (
                  <td
                    key={key}
                    onClick={() => handleCellClick(r, c)}
                    style={{
                      width: CELL,
                      height: CELL,
                      backgroundColor: bg,
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#1e293b',
                      userSelect: 'none',
                    }}
                  >
                    {letter}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default CrosswordGrid;
