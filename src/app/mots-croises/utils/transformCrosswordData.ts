import type { CrosswordData } from '@/app/clients/sanityClient';

export type LibraryClue = {
  clue: string;
  answer: string;
  row: number;
  col: number;
};

export type LibraryFormat = {
  across: Record<string, LibraryClue>;
  down: Record<string, LibraryClue>;
};

export function transformForLibrary(data: CrosswordData): LibraryFormat {
  const across: LibraryFormat['across'] = {};
  const down: LibraryFormat['down'] = {};

  for (const entry of data.gridData.across) {
    across[String(entry.number)] = {
      clue: entry.clue || entry.termSlug || '—',
      answer: entry.answer.toUpperCase(),
      row: entry.row,
      col: entry.col,
    };
  }

  for (const entry of data.gridData.down) {
    down[String(entry.number)] = {
      clue: entry.clue || entry.termSlug || '—',
      answer: entry.answer.toUpperCase(),
      row: entry.row,
      col: entry.col,
    };
  }

  return { across, down };
}
