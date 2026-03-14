'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CrosswordEditor from '../../components/CrosswordEditor';
import CrosswordImageUpload from '../../components/CrosswordImageUpload';
import ClueEditor from '../../components/ClueEditor';
import { logout } from '../../../actions/auth';
import { saveSetupAction } from '../../../actions/crossword';
import type { CrosswordAdminData } from '@/app/clients/sanityClient';
import { stringToPortableText, type PortableTextBlock } from '../../utils/portableText';
type SlotFormData = { answer: string; clue: PortableTextBlock[]; termId?: string; termSlug?: string };

function reconstructGrid(data: CrosswordAdminData): boolean[][] {
  const { rows, cols, across, down } = data.gridData;
  const grid: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(true));
  for (const e of across) for (let i = 0; i < e.answer.length; i++) grid[e.row][e.col + i] = false;
  for (const e of down) for (let i = 0; i < e.answer.length; i++) grid[e.row + i][e.col] = false;
  return grid;
}

function normalizeClue(clue: unknown): PortableTextBlock[] {
  if (typeof clue === 'string') return stringToPortableText(clue);
  if (Array.isArray(clue) && clue.length > 0) return clue as PortableTextBlock[];
  return [];
}

function reconstructSlotData(data: CrosswordAdminData): Record<string, SlotFormData> {
  const result: Record<string, SlotFormData> = {};
  for (const e of data.gridData.across) {
    result[`across-${e.number}`] = { answer: e.answer, clue: normalizeClue(e.clue), termId: e.termId, termSlug: e.termSlug };
  }
  for (const e of data.gridData.down) {
    result[`down-${e.number}`] = { answer: e.answer, clue: normalizeClue(e.clue), termId: e.termId, termSlug: e.termSlug };
  }
  return result;
}

function utcToMontrealLocal(iso?: string): string {
  if (!iso) return '';
  const str = new Date(iso).toLocaleString('sv-SE', { timeZone: 'America/Toronto' });
  return str.slice(0, 16).replace(' ', 'T');
}

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

type SetupData = { title: string; slug: string; difficulty: string; description: string; rows: number; cols: number; availableFrom: string; solutionFrom: string; imageAssetId?: string; imageUrl?: string; imageCaption?: PortableTextBlock[] };

export default function EditCrosswordClient({ data, initialPhase = 'editor' }: { data: CrosswordAdminData; initialPhase?: 'setup' | 'editor' }) {
  const [phase, setPhase] = useState<'setup' | 'editor'>(initialPhase);
  const [isSavingSetup, startSavingSetup] = useTransition();
  const [setupSaveError, setSetupSaveError] = useState<string | null>(null);
  const [setup, setSetup] = useState<SetupData>({
    title: data.title,
    slug: data.slug,
    difficulty: data.difficulty,
    description: data.description ?? '',
    rows: data.gridData.rows,
    cols: data.gridData.cols,
    availableFrom: utcToMontrealLocal(data.availableFrom),
    solutionFrom: utcToMontrealLocal(data.solutionFrom),
    imageAssetId: data.imageAssetId,
    imageUrl: data.imageUrl,
    imageCaption: data.imageCaption as PortableTextBlock[] | undefined,
  });

  const initialGrid = reconstructGrid(data);
  const initialSlotData = reconstructSlotData(data);

  if (phase === 'editor') {
    return (
      <div className="flex flex-col flex-grow overflow-auto">
        <div className="px-4 py-6 mx-auto w-fit">
          <div className="mb-4">
            <Link href="/admin/mots-croises" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
              ← Retour à la liste
            </Link>
          </div>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{setup.title}</h1>
              <p className="text-sm text-slate-500">{setup.rows}×{setup.cols} · {setup.difficulty}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setPhase('setup')}>
                ← Modifier les infos
              </Button>
              <form action={logout}>
                <Button variant="ghost" size="sm" type="submit">Déconnexion</Button>
              </form>
            </div>
          </div>
          <CrosswordEditor
            rows={setup.rows}
            cols={setup.cols}
            title={setup.title}
            slug={setup.slug}
            difficulty={setup.difficulty}
            description={setup.description}
            availableFrom={setup.availableFrom}
            solutionFrom={setup.solutionFrom}
            imageAssetId={setup.imageAssetId}
            imageCaption={setup.imageCaption}
            crosswordId={data._id}
            initialGrid={initialGrid}
            initialSlotData={initialSlotData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow overflow-auto">
      <div className="container px-4 py-8 mx-auto max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Modifier le mot croisé</h1>
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit">Déconnexion</Button>
          </form>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
            <Input
              value={setup.title}
              onChange={e => setSetup(prev => ({ ...prev, title: e.target.value, slug: slugify(e.target.value) }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
            <Input
              value={setup.slug}
              onChange={e => setSetup(prev => ({ ...prev, slug: e.target.value }))}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Difficulté</label>
            <select
              value={setup.difficulty}
              onChange={e => setSetup(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description <span className="font-normal text-slate-400">(optionnel)</span>
            </label>
            <textarea
              value={setup.description}
              rows={2}
              onChange={e => setSetup(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Disponible à partir de <span className="font-normal text-slate-400">(heure de Montréal, optionnel)</span>
              </label>
              <Input
                type="datetime-local"
                value={setup.availableFrom}
                onChange={e => setSetup(prev => ({ ...prev, availableFrom: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Solution visible à partir de <span className="font-normal text-slate-400">(heure de Montréal, optionnel)</span>
              </label>
              <Input
                type="datetime-local"
                value={setup.solutionFrom}
                onChange={e => setSetup(prev => ({ ...prev, solutionFrom: e.target.value }))}
              />
            </div>
          </div>

          <CrosswordImageUpload
            currentImageUrl={setup.imageUrl}
            onUpload={(assetId, previewUrl) => setSetup(prev => ({ ...prev, imageAssetId: assetId, imageUrl: previewUrl }))}
            onRemove={() => setSetup(prev => ({ ...prev, imageAssetId: undefined, imageUrl: undefined }))}
          />

          {setup.imageAssetId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Légende de la photo <span className="font-normal text-slate-400">(optionnel)</span>
              </label>
              <ClueEditor
                value={setup.imageCaption ?? []}
                onChange={imageCaption => setSetup(prev => ({ ...prev, imageCaption }))}
                placeholder="Amanita muscaria (Jean Després, 2021)…"
              />
            </div>
          )}

          {setupSaveError && (
            <p className="text-sm text-red-600">{setupSaveError}</p>
          )}
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isSavingSetup}
            onClick={() => {
              setSetupSaveError(null);
              startSavingSetup(async () => {
                try {
                  await saveSetupAction(data._id, data.slug, setup);
                  setPhase('editor');
                } catch {
                  setSetupSaveError('Erreur lors de la sauvegarde. Veuillez réessayer.');
                }
              });
            }}
          >
            {isSavingSetup ? 'Enregistrement…' : 'Modifier la grille →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
