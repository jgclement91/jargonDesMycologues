'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, ExternalLink } from 'lucide-react';
import type { WordSlot } from './gridUtils';
import ClueEditor from './ClueEditor';
import type { PortableTextBlock } from '../utils/portableText';

type SlotFormData = {
  answer: string;
  clue: PortableTextBlock[];
  termId?: string;
  termSlug?: string;
};

type Props = {
  slot: WordSlot | null;
  data: SlotFormData;
  onChange: (data: SlotFormData) => void;
};

type TermResult = { _id: string; term: string };

export default function WordSlotPanel({ slot, data, onChange }: Props) {
  const [termQuery, setTermQuery] = useState('');
  const [termResults, setTermResults] = useState<TermResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLInputElement>(null);
  const slotJustChangedRef = useRef(false);

  // Focus when slot changes
  useEffect(() => {
    if (slot) {
      slotJustChangedRef.current = true;
      answerRef.current?.focus();
    }
  }, [slot?.id]);

  // Once the merged answer arrives (after CrosswordEditor updates slotData),
  // position cursor at the first empty (space) position
  useEffect(() => {
    if (!slotJustChangedRef.current || !answerRef.current) return;
    slotJustChangedRef.current = false;
    const firstEmpty = data.answer.indexOf(' ');
    if (firstEmpty !== -1) {
      answerRef.current.setSelectionRange(firstEmpty, firstEmpty + 1);
    }
  }, [data.answer]);

  const searchTerms = useCallback(async (query: string) => {
    if (!query.trim()) {
      setTermResults([]);
      setShowDropdown(false);
      return;
    }
    const res = await fetch(`/api/admin/terms?q=${encodeURIComponent(query)}`);
    const results: TermResult[] = await res.json();
    setTermResults(results);
    setShowDropdown(true);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchTerms(termQuery), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [termQuery, searchTerms]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setTermQuery(data.termSlug ?? '');
  }, [slot?.id, data.termSlug]);

  if (!slot) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Sélectionnez un mot dans la grille
      </div>
    );
  }

  const directionLabel = slot.direction === 'across' ? 'Horizontal' : 'Vertical';

  const handleAnswerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (
      start !== null && end !== null && start === end &&
      input.value[start] === ' ' &&
      e.key.length === 1 && /[a-zA-ZÀ-ÖØ-öø-ÿ]/.test(e.key) &&
      !e.ctrlKey && !e.metaKey
    ) {
      input.setSelectionRange(start, start + 1);
    }
  };

  const handleSelectTerm = (term: TermResult) => {
    setTermQuery(term.term);
    setShowDropdown(false);
    onChange({ ...data, termId: term._id, termSlug: term.term });
  };

  const handleClearTerm = () => {
    setTermQuery('');
    onChange({ ...data, termId: undefined, termSlug: undefined });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-800 text-lg">
          {slot.number} {directionLabel}
        </span>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {slot.length} lettres
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Réponse
        </label>
        <Input
          ref={answerRef}
          value={data.answer}
          maxLength={slot.length}
          placeholder={'_'.repeat(slot.length)}
          className="uppercase font-mono tracking-widest"
          onChange={e => onChange({ ...data, answer: e.target.value.toUpperCase() })}
          onKeyDown={handleAnswerKeyDown}
        />
        {data.answer.length > 0 && data.answer.length !== slot.length && (
          <p className="text-xs text-amber-600 mt-1">
            {data.answer.length}/{slot.length} lettres
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Indice
        </label>
        <ClueEditor
          value={data.clue}
          onChange={clue => onChange({ ...data, clue })}
          placeholder="Définition ou indice pour ce mot…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Lier un terme du glossaire <span className="font-normal text-slate-400">(optionnel)</span>
        </label>
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={termQuery}
              placeholder="Rechercher un terme…"
              className="pl-9 pr-8"
              onChange={e => {
                setTermQuery(e.target.value);
                if (!e.target.value) handleClearTerm();
              }}
              onFocus={() => termResults.length > 0 && setShowDropdown(true)}
            />
            {data.termId && (
              <button
                type="button"
                onClick={handleClearTerm}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {showDropdown && termResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {termResults.map(term => (
                <button
                  key={term._id}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 text-slate-700"
                  onClick={() => handleSelectTerm(term)}
                >
                  {term.term}
                </button>
              ))}
            </div>
          )}
        </div>
        {data.termId && (
          <a
            href={`/glossaire/${data.termSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 mt-1"
          >
            <ExternalLink className="h-3 w-3" />
            Voir dans le glossaire
          </a>
        )}
      </div>
    </div>
  );
}
