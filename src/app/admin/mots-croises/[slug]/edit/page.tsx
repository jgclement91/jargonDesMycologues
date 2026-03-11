import { fetchCrosswordForEdit } from '@/app/clients/sanityClient';
import EditCrosswordClient from './EditCrosswordClient';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export default async function EditCrosswordPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchCrosswordForEdit(slug);
  if (!data) notFound();

  return <EditCrosswordClient data={data} />;
}
