export type WordSlot = {
  id: string;
  direction: 'across' | 'down';
  number: number;
  row: number;
  col: number;
  length: number;
};

export function computeSlots(grid: boolean[][], rows: number, cols: number): WordSlot[] {
  const acrossRaw: Array<{ row: number; col: number; length: number }> = [];
  const downRaw: Array<{ row: number; col: number; length: number }> = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c]) continue;

      const startsAcross =
        (c === 0 || grid[r][c - 1]) &&
        c < cols - 1 && !grid[r][c + 1];

      const startsDown =
        (r === 0 || grid[r - 1][c]) &&
        r < rows - 1 && !grid[r + 1][c];

      if (startsAcross) {
        let length = 0;
        let tc = c;
        while (tc < cols && !grid[r][tc]) { length++; tc++; }
        acrossRaw.push({ row: r, col: c, length });
      }

      if (startsDown) {
        let length = 0;
        let tr = r;
        while (tr < rows && !grid[tr][c]) { length++; tr++; }
        downRaw.push({ row: r, col: c, length });
      }
    }
  }

  return [
    ...acrossRaw.map((s, i) => ({ id: `across-${i + 1}`, direction: 'across' as const, number: i + 1, ...s })),
    ...downRaw.map((s, i) => ({ id: `down-${i + 1}`, direction: 'down' as const, number: i + 1, ...s })),
  ];
}

export function computeCellNumbers(slots: WordSlot[]): Record<string, { across?: number; down?: number }> {
  const numbers: Record<string, { across?: number; down?: number }> = {};
  for (const slot of slots) {
    const key = `${slot.row}-${slot.col}`;
    if (!numbers[key]) numbers[key] = {};
    numbers[key][slot.direction] = slot.number;
  }
  return numbers;
}

export function getCellsForSlot(slot: WordSlot): Array<{ row: number; col: number }> {
  const cells = [];
  for (let i = 0; i < slot.length; i++) {
    cells.push(
      slot.direction === 'across'
        ? { row: slot.row, col: slot.col + i }
        : { row: slot.row + i, col: slot.col }
    );
  }
  return cells;
}

export function buildEmptyGrid(rows: number, cols: number): boolean[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

export function toggleCell(grid: boolean[][], row: number, col: number): boolean[][] {
  const next = grid.map(r => [...r]);
  next[row][col] = !next[row][col];
  return next;
}
