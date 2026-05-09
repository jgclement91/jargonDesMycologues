'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteCrosswordAction } from '../../actions/crossword';

type Props = { id: string; slug: string; title: string };

export default function DeleteCrosswordButton({ id, slug, title }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`Supprimer « ${title} » ? Cette action est irréversible.`)) return;
    startTransition(() => deleteCrosswordAction(id, slug));
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={isPending} className="text-red-600 hover:text-red-700 hover:bg-red-50">
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
