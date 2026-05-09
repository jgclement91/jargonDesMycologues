import type { CrosswordData } from '@/app/clients/sanityClient';

type PortableTextBlock = { _type: string; _key: string; [key: string]: unknown };

export type LibraryClue = {
  clue: PortableTextBlock[];
  answer: string;
  row: number;
  col: number;
  termSlug?: string;
};

export type LibraryFormat = {
  across: Record<string, LibraryClue>;
  down: Record<string, LibraryClue>;
};

function fallbackBlock(text: string): PortableTextBlock[] {
  return [{ _type: 'block', _key: 'fb', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 'fb1', text, marks: [] }] }];
}

function normalizeClue(clue: unknown, fallback: string): PortableTextBlock[] {
  if (typeof clue === 'string' && clue.trim()) return fallbackBlock(clue);
  if (Array.isArray(clue) && clue.length > 0) return clue as PortableTextBlock[];
  return fallbackBlock(fallback);
}

export function transformForLibrary(data: CrosswordData): LibraryFormat {
  const across: LibraryFormat['across'] = {};
  const down: LibraryFormat['down'] = {};

  for (const entry of data.gridData.across) {
    across[String(entry.number)] = {
      clue: normalizeClue(entry.clue, entry.termSlug || '—'),
      answer: entry.answer.toUpperCase(),
      row: entry.row,
      col: entry.col,
      termSlug: entry.termSlug,
    };
  }

  for (const entry of data.gridData.down) {
    down[String(entry.number)] = {
      clue: normalizeClue(entry.clue, entry.termSlug || '—'),
      answer: entry.answer.toUpperCase(),
      row: entry.row,
      col: entry.col,
      termSlug: entry.termSlug,
    };
  }

  return { across, down };
}
