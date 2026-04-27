'use server';

import { createCrossword, updateCrossword, updateCrosswordMetadata, deleteCrossword, fetchCrosswordForEdit } from '@/app/clients/sanityClient';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type PortableTextBlock = { _type: string; _key: string; [key: string]: unknown };

type SlotInput = {
  number: number;
  row: number;
  col: number;
  answer: string;
  clue: PortableTextBlock[];
  termId?: string;
};

type SaveCrosswordInput = {
  title: string;
  slug: string;
  difficulty: string;
  description?: string;
  availableFrom?: string;
  imageAssetId?: string;
  imageCaption?: PortableTextBlock[];
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

export async function saveSetupAction(id: string, originalSlug: string, data: Omit<SaveCrosswordInput, 'gridData'>) {
  await updateCrosswordMetadata(id, {
    ...data,
    availableFrom: data.availableFrom ? montrealToUtcIso(data.availableFrom) : undefined,
  });
  revalidatePath('/mots-croises');
  revalidatePath(`/mots-croises/${originalSlug}`);
  if (data.slug !== originalSlug) revalidatePath(`/mots-croises/${data.slug}`);
}

export async function editCrossword(id: string, originalSlug: string, data: SaveCrosswordInput) {
  await updateCrossword(id, {
    ...data,
    availableFrom: data.availableFrom ? montrealToUtcIso(data.availableFrom) : undefined,
  });
  revalidatePath('/mots-croises');
  revalidatePath(`/mots-croises/${originalSlug}`);
  if (data.slug !== originalSlug) revalidatePath(`/mots-croises/${data.slug}`);
  redirect(`/mots-croises/${data.slug}`);
}

export async function duplicateCrosswordAction(slug: string, newSlug: string) {
  const original = await fetchCrosswordForEdit(slug);
  if (!original) throw new Error('Crossword not found');

  const newTitle = `Copie de ${original.title}`;

  await createCrossword({
    title: newTitle,
    slug: newSlug,
    difficulty: original.difficulty,
    description: original.description,
    imageAssetId: original.imageAssetId,
    imageCaption: original.imageCaption,
    gridData: {
      rows: original.gridData.rows,
      cols: original.gridData.cols,
      across: original.gridData.across.map(e => ({ number: e.number, row: e.row, col: e.col, answer: e.answer, clue: e.clue, termId: e.termId })),
      down: original.gridData.down.map(e => ({ number: e.number, row: e.row, col: e.col, answer: e.answer, clue: e.clue, termId: e.termId })),
    },
  });

  revalidatePath('/admin/mots-croises');
  redirect(`/admin/mots-croises/${newSlug}/edit?phase=setup`);
}

export async function deleteCrosswordAction(id: string, slug: string) {
  await deleteCrossword(id);
  revalidatePath('/mots-croises');
  revalidatePath(`/mots-croises/${slug}`);
  redirect('/admin/mots-croises');
}

export async function saveCrossword(data: SaveCrosswordInput) {
  await createCrossword({
    ...data,
    availableFrom: data.availableFrom ? montrealToUtcIso(data.availableFrom) : undefined,
  });
  revalidatePath('/mots-croises');
  revalidatePath(`/mots-croises/${data.slug}`);
  redirect(`/mots-croises/${data.slug}`);
}
