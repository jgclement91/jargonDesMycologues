import { getAllCrosswords } from '@/app/clients/sanityClient';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import GlossaireWrapper from '@/app/components/glossaire-wrapper';
import CrosswordCompleteBadge from './components/CrosswordCompleteBadge';

export const metadata: Metadata = {
  title: 'Croisements de champignons',
  description: 'Testez vos connaissances du jargon mycologique avec nos mots croisés.',
};

const difficultyStyles: Record<string, string> = {
  facile: 'bg-emerald-100 text-emerald-800',
  moyen: 'bg-yellow-100 text-yellow-800',
  difficile: 'bg-red-100 text-red-800',
};

export default async function MotsCroisesPage() {
  const crosswords = await getAllCrosswords();

  return (
    <GlossaireWrapper>
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Croisements de champignons</h1>
        <p className="text-slate-600 mb-8">
          Testez vos connaissances du jargon mycologique. Plusieurs indices sont inspirés du glossaire.
        </p>

        {crosswords.length === 0 ? (
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-500">Aucun mot croisé disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {crosswords.map(crossword => (
              <Link
                key={crossword._id}
                href={`/mots-croises/${crossword.slug}`}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-emerald-500 hover:shadow-md transition-all"
              >
                {crossword.imageUrl && (
                  <div className="relative w-full aspect-video">
                    <Image src={crossword.imageUrl} alt={crossword.title} fill className="object-cover" unoptimized />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-lg font-semibold text-slate-800">{crossword.title}</h2>
                    <div className="shrink-0 flex items-center gap-1.5">
                      <CrosswordCompleteBadge crosswordId={crossword._id} />
                      {crossword.difficulty && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyStyles[crossword.difficulty] ?? ''}`}>
                          {crossword.difficulty.charAt(0).toUpperCase() + crossword.difficulty.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  {crossword.description && (
                    <p className="text-slate-500 text-sm line-clamp-2">{crossword.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </GlossaireWrapper>
  );
}
