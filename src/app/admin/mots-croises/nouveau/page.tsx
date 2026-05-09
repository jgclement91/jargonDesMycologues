'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CrosswordEditor from '../components/CrosswordEditor';
import CrosswordImageUpload from '../components/CrosswordImageUpload';
import ClueEditor from '../components/ClueEditor';
import type { PortableTextBlock } from '../utils/portableText';
import { logout } from '../../actions/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type SetupData = {
  title: string;
  slug: string;
  slugFrozen: boolean;
  difficulty: string;
  description: string;
  rows: number;
  cols: number;
  availableFrom: string;
  imageAssetId?: string;
  imageUrl?: string;
  imageCaption?: PortableTextBlock[];
};

const SETUP_KEY = 'crossword-editor-setup';

function loadSetup(): { setup: SetupData; phase: 'setup' | 'editor' } | null {
  try {
    const raw = localStorage.getItem(SETUP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function NouveauMotCroisePage() {
  const [phase, setPhase] = useState<'setup' | 'editor'>('setup');
  const [setup, setSetup] = useState<SetupData>({
    title: '',
    slug: '',
    slugFrozen: false,
    difficulty: 'moyen',
    description: '',
    rows: 14,
    cols: 14,
    availableFrom: '',
  });

  useEffect(() => {
    const saved = loadSetup();
    if (saved) {
      setSetup(saved.setup);
      setPhase(saved.phase);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(SETUP_KEY, JSON.stringify({ setup, phase })); } catch { /* ignore */ }
  }, [setup, phase]);

  const handleTitleChange = (title: string) => {
    setSetup(prev => prev.slugFrozen ? { ...prev, title } : { ...prev, title, slug: slugify(title) });
  };

  const canProceed = setup.title.trim() && setup.slug.trim() && setup.rows >= 5 && setup.cols >= 5;

  if (phase === 'editor') {
    return (
      <div className="flex flex-col flex-grow overflow-auto">
        <div className="container px-4 py-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{setup.title}</h1>
              <p className="text-sm text-slate-500">{setup.rows}×{setup.cols} · {setup.difficulty}</p>
            </div>
            <div className="flex gap-2">
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
            imageAssetId={setup.imageAssetId}
          imageCaption={setup.imageCaption}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow overflow-auto">
      <div className="container px-4 py-8 mx-auto max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin/mots-croises" className="text-xs text-emerald-600 hover:underline">← Tous les mots croisés</Link>
            <h1 className="text-2xl font-bold text-slate-800">Nouveau mot croisé</h1>
          </div>
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit">Déconnexion</Button>
          </form>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
            <Input
              value={setup.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Les champignons du Québec"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug (URL)
              {setup.slugFrozen && <span className="ml-2 text-xs text-slate-400 font-normal">🔒 verrouillé</span>}
            </label>
            <Input
              value={setup.slug}
              onChange={e => !setup.slugFrozen && setSetup(prev => ({ ...prev, slug: e.target.value }))}
              readOnly={setup.slugFrozen}
              placeholder="les-champignons-du-quebec"
              className={`font-mono text-sm ${setup.slugFrozen ? 'bg-slate-50 text-slate-400' : ''}`}
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
              placeholder="Un mot croisé sur les champignons du Québec…"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Rangées</label>
              <Input
                type="number"
                min={5}
                max={25}
                value={setup.rows}
                onChange={e => setSetup(prev => ({ ...prev, rows: Number(e.target.value) }))}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Colonnes</label>
              <Input
                type="number"
                min={5}
                max={25}
                value={setup.cols}
                onChange={e => setSetup(prev => ({ ...prev, cols: Number(e.target.value) }))}
              />
            </div>
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

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={!canProceed}
            onClick={() => { setSetup(prev => ({ ...prev, slugFrozen: true })); setPhase('editor'); }}
          >
            Créer la grille →
          </Button>
        </div>
      </div>
    </div>
  );
}
