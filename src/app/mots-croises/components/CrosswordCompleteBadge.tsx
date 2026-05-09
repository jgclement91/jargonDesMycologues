'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CrosswordCompleteBadge({ crosswordId }: { crosswordId: string }) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      setCompleted(localStorage.getItem(`crossword-${crosswordId}-complete`) === '1');
    } catch { /* ignore */ }
  }, [crosswordId]);

  if (!completed) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="h-3 w-3" />
      Complété
    </span>
  );
}
