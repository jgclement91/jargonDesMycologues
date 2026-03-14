'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { LibraryFormat } from '../utils/transformCrosswordData';

export type CrosswordGridImperative = {
  reset: () => void;
  focusWord: (row: number, col: number, dir: 'across' | 'down') => void;
  focusFirstEmptyInWord: (row: number, col: number, dir: 'across' | 'down') => void;
};

export type FocusChangeState = {
  row: number;
  col: number;
  dir: 'across' | 'down';
  wordNum: number | null;
} | null;

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
  showSolution?: boolean;
  onComplete?: (correct: boolean) => void;
  onFocusChange?: (state: FocusChangeState) => void;
  onWordComplete?: (row: number, col: number, dir: 'across' | 'down') => void;
};

const MAX_CELL = 36;
const ROW_LABEL_WIDTH = 24;

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
  { data, rows, cols, storageKey, showSolution, onComplete, onFocusChange, onWordComplete },
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
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const onCompleteRef = useRef(onComplete);
  const onFocusChangeRef = useRef(onFocusChange);
  const onWordCompleteRef = useRef(onWordComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { onFocusChangeRef.current = onFocusChange; }, [onFocusChange]);
  useEffect(() => { onWordCompleteRef.current = onWordComplete; }, [onWordComplete]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cellSize = containerWidth > 0
    ? Math.min(MAX_CELL, Math.floor((containerWidth - ROW_LABEL_WIDTH) / cols))
    : MAX_CELL;

  const startNumbers = useMemo(() => {
    const map = new Map<string, { across?: number; down?: number }>();
    for (const [num, entry] of Object.entries(data.across)) {
      const key = `${entry.row}-${entry.col}`;
      const existing = map.get(key) ?? {};
      map.set(key, { ...existing, across: Number(num) });
    }
    for (const [num, entry] of Object.entries(data.down)) {
      const key = `${entry.row}-${entry.col}`;
      const existing = map.get(key) ?? {};
      map.set(key, { ...existing, down: Number(num) });
    }
    return map;
  }, [data]);

  useEffect(() => {
    if (!focused) {
      onFocusChangeRef.current?.(null);
      return;
    }
    const wordNum = direction === 'across'
      ? grid[focused.row][focused.col].acrossNum
      : grid[focused.row][focused.col].downNum;
    onFocusChangeRef.current?.({ row: focused.row, col: focused.col, dir: direction, wordNum: wordNum ?? null });
  }, [focused, direction, grid]);

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
    hiddenInputRef.current?.focus();
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
      else onWordCompleteRef.current?.(row, col, direction);
    }
  }, [focused, direction, findNext, writeLetter]);

  const handleHiddenInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!focused) return;
    const char = e.target.value.slice(-1);
    e.target.value = '';
    if (/^[a-zA-ZÀ-ÖØ-öø-ÿ]$/.test(char)) {
      writeLetter(focused.row, focused.col, char.toUpperCase());
      const next = findNext(focused.row, focused.col, direction, 1);
      if (next) setFocused(next);
      else onWordCompleteRef.current?.(focused.row, focused.col, direction);
    }
  }, [focused, direction, writeLetter, findNext]);

  const handleHiddenInputBeforeInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const inputType = (e.nativeEvent as InputEvent).inputType;
    if (inputType === 'deleteContentBackward' && focused) {
      e.preventDefault();
      writeLetter(focused.row, focused.col, '');
      const prev = findNext(focused.row, focused.col, direction, -1);
      if (prev) setFocused(prev);
    }
  }, [focused, direction, writeLetter, findNext]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setLetters({});
      setFocused(null);
      try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    },
    focusWord: (row: number, col: number, dir: 'across' | 'down') => {
      setFocused({ row, col });
      setDirection(dir);
      hiddenInputRef.current?.focus();
    },
    focusFirstEmptyInWord: (row: number, col: number, dir: 'across' | 'down') => {
      const cells = getWordCells(data, grid, row, col, dir);
      const target = cells.find(c => !(letters[`${c.row}-${c.col}`])) ?? cells[0];
      if (target) {
        setFocused(target);
        setDirection(dir);
        hiddenInputRef.current?.focus();
      }
    },
  }), [grid, rows, cols, storageKey, data, letters]);

  const numFontSize = Math.max(7, Math.min(9, cellSize / 4));
  const letterFontSize = Math.max(11, Math.round(cellSize * 0.42));

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto w-full"
    >
      <input
        ref={hiddenInputRef}
        aria-hidden="true"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        onKeyDown={handleKeyDown}
        onChange={handleHiddenInputChange}
        onBeforeInput={handleHiddenInputBeforeInput}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, top: 0, left: 0, border: 'none', padding: 0 }}
        readOnly={false}
      />
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ width: ROW_LABEL_WIDTH }} />
            {Array.from({ length: cols }, (_, c) => (
              <th
                key={c}
                style={{ width: cellSize, height: 20, fontWeight: 'normal', fontSize: 11 }}
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
                style={{ width: ROW_LABEL_WIDTH, height: cellSize, fontSize: 11 }}
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
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: '#000',
                        border: '1px solid #000',
                      }}
                    />
                  );
                }

                const isFocused = focused?.row === r && focused?.col === c;
                const isInWord = wordCells.has(key);
                const userLetter = letters[key] ?? '';
                const isCorrect = userLetter.toUpperCase() === cell.answer.toUpperCase();
                const displayLetter = showSolution
                  ? (isCorrect && userLetter ? userLetter : cell.answer)
                  : userLetter;
                const letterColor = showSolution
                  ? (isCorrect && userLetter ? '#16a34a' : '#94a3b8')
                  : '#1e293b';
                const bg = isFocused ? '#d1fae5' : isInWord ? '#dbeafe' : '#fff';
                const startNum = startNumbers.get(key);

                return (
                  <td
                    key={key}
                    onClick={() => handleCellClick(r, c)}
                    style={{
                      position: 'relative',
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: bg,
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontSize: letterFontSize,
                      fontWeight: 600,
                      color: letterColor,
                      userSelect: 'none',
                    }}
                  >
                    {startNum !== undefined && (
                      <>
                        {startNum.across !== undefined && (
                          <span
                            style={{
                              position: 'absolute',
                              top: 1,
                              left: 1,
                              fontSize: numFontSize,
                              lineHeight: 1,
                              color: '#64748b',
                              fontWeight: 600,
                              pointerEvents: 'none',
                            }}
                          >
                            {startNum.across}
                          </span>
                        )}
                        {startNum.down !== undefined && (
                          <span
                            style={{
                              position: 'absolute',
                              top: 1,
                              right: 1,
                              fontSize: numFontSize,
                              lineHeight: 1,
                              color: '#64748b',
                              fontWeight: 600,
                              pointerEvents: 'none',
                            }}
                          >
                            {startNum.down}
                          </span>
                        )}
                      </>
                    )}
                    {displayLetter}
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
