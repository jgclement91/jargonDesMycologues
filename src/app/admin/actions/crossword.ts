'use server';

import { createCrossword } from '@/app/clients/sanityClient';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type SlotInput = {
  number: number;
  row: number;
  col: number;
  answer: string;
  clue: string;
  termId?: string;
};

type SaveCrosswordInput = {
  title: string;
  slug: string;
  difficulty: string;
  description?: string;
  availableFrom?: string;
  solutionFrom?: string;
  gridData: {
    rows: number;
    cols: number;
    across: SlotInput[];
    down: SlotInput[];
  };
};

function montrealToUtcIso(datetimeLocal: string): string {
  if (!datetimeLocal) return '';
  // Parse the datetime-local string as a UTC instant, then apply Montreal offset
  const utcApprox = new Date(datetimeLocal + ':00.000Z');
  const montrealStr = utcApprox.toLocaleString('en-US', { timeZone: 'America/Toronto' });
  const montrealDate = new Date(montrealStr);
  const offsetMs = utcApprox.getTime() - montrealDate.getTime();
  return new Date(utcApprox.getTime() + offsetMs).toISOString();
}

export async function saveCrossword(data: SaveCrosswordInput) {
  await createCrossword({
    ...data,
    availableFrom: data.availableFrom ? montrealToUtcIso(data.availableFrom) : undefined,
    solutionFrom: data.solutionFrom ? montrealToUtcIso(data.solutionFrom) : undefined,
  });
  revalidatePath('/mots-croises');
  revalidatePath(`/mots-croises/${data.slug}`);
  redirect(`/mots-croises/${data.slug}`);
}
