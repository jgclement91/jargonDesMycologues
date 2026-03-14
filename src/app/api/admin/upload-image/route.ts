import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { createClient } from '@sanity/client';

function generateSessionToken(password: string): string {
  return createHash('sha256').update(password + ':admin-session').digest('hex');
}

const sanityWriteClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID ?? 'pe3dn4r6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_READWRITE_TOKEN,
  useCdn: false,
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  const expected = generateSessionToken(process.env.ADMIN_PASSWORD!);

  if (!session || session.value !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await sanityWriteClient.assets.upload('image', buffer, {
    filename: file.name,
    contentType: file.type,
  });

  return Response.json({ assetId: asset._id });
}
