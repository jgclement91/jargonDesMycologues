import { fetchCrossword, getAllCrosswordSlugs } from '@/app/clients/sanityClient';
import { transformForLibrary } from '../utils/transformCrosswordData';
import CrosswordPlayer from '../components/CrosswordPlayer';
import GlossaireWrapper from '@/app/components/glossaire-wrapper';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllCrosswordSlugs();
  return slugs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchCrossword(slug);
  if (!data) return { title: 'Mot croisé introuvable' };
  return {
    title: `${data.title} — Mots Croisés`,
    description: data.description ?? `Mot croisé mycologique · niveau ${data.difficulty}`,
  };
}

const difficultyStyles: Record<string, string> = {
  facile: 'bg-emerald-100 text-emerald-800',
  moyen: 'bg-yellow-100 text-yellow-800',
  difficile: 'bg-red-100 text-red-800',
};

export default async function CrosswordPage({ params }: Props) {
  const { slug } = await params;
  const sanityData = await fetchCrossword(slug);
  if (!sanityData) notFound();

  const crosswordData = transformForLibrary(sanityData);
  const solutionAvailable = !!sanityData.solutionFrom && new Date(sanityData.solutionFrom) <= new Date();

  return (
    <GlossaireWrapper>
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <Link
          href="/mots-croises"
          className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les mots croisés
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{sanityData.title}</h1>
            {sanityData.description && (
              <p className="text-slate-500 mt-1">{sanityData.description}</p>
            )}
          </div>
          {sanityData.difficulty && (
            <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${difficultyStyles[sanityData.difficulty] ?? ''}`}>
              {sanityData.difficulty.charAt(0).toUpperCase() + sanityData.difficulty.slice(1)}
            </span>
          )}
        </div>

        <CrosswordPlayer
          data={crosswordData}
          crosswordId={sanityData._id}
          solutionAvailable={solutionAvailable}
          rows={sanityData.gridData.rows}
          cols={sanityData.gridData.cols}
          imageUrl={sanityData.imageUrl}
          imageAlt={sanityData.title}
          imageCaption={sanityData.imageCaption}
        />
      </div>
    </GlossaireWrapper>
  );
}
