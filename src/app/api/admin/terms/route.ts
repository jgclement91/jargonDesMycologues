import { searchGlossaryTerms } from '@/app/clients/sanityClient';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

function generateSessionToken(password: string): string {
  return createHash('sha256').update(password + ':admin-session').digest('hex');
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  const expected = generateSessionToken(process.env.ADMIN_PASSWORD!);

  if (!session || session.value !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';

  if (!q.trim()) {
    return Response.json([]);
  }

  const results = await searchGlossaryTerms(q);
  return Response.json(results);
}
