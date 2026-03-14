import { fetchCrosswordForEdit } from '@/app/clients/sanityClient';
import EditCrosswordClient from './EditCrosswordClient';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ phase?: string }> };

export default async function EditCrosswordPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { phase } = await searchParams;
  const data = await fetchCrosswordForEdit(slug);
  if (!data) notFound();

  return <EditCrosswordClient data={data} initialPhase={phase === 'setup' ? 'setup' : 'editor'} />;
}
