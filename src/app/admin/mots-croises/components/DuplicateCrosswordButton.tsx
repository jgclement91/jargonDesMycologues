'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { duplicateCrosswordAction } from '../../actions/crossword';

type Props = { slug: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function DuplicateCrosswordButton({ slug }: Props) {
  const [open, setOpen] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setNewSlug(`${slug}-copie`);
      setTimeout(() => inputRef.current?.select(), 50);
    }
  }, [open, slug]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  const handleConfirm = () => {
    const cleaned = slugify(newSlug);
    if (!cleaned) return;
    startTransition(() => duplicateCrosswordAction(slug, cleaned));
  };

  return (
    <>
      <Button variant="ghost" size="sm" title="Dupliquer" onClick={() => setOpen(true)}>
        <Copy className="h-4 w-4" />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <h2 className="text-base font-semibold text-slate-800">Dupliquer le mot croisé</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL) de la copie</label>
              <Input
                ref={inputRef}
                value={newSlug}
                onChange={e => setNewSlug(e.target.value)}
                placeholder="mon-nouveau-slug"
                className="font-mono text-sm"
                onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
              />
              {newSlug && slugify(newSlug) !== newSlug && (
                <p className="text-xs text-slate-400 mt-1">Sera normalisé en : <span className="font-mono">{slugify(newSlug)}</span></p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={isPending}>
                Annuler
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!slugify(newSlug) || isPending}
                onClick={handleConfirm}
              >
                {isPending ? 'Duplication…' : 'Dupliquer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
