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

function stringToBlock(text: string) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 9),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 9), text, marks: [] }],
  };
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  const expected = generateSessionToken(process.env.ADMIN_PASSWORD!);

  if (!session || session.value !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const crosswords = await sanityWriteClient.fetch(
    `*[_type == "crossword"] { _id, "gridData": gridData { across, down } }`
  );

  let migratedCount = 0;

  for (const doc of crosswords) {
    const mapEntries = (entries: Array<{ _key: string; clue: unknown }>) =>
      entries.map(entry => ({
        ...entry,
        clue: typeof entry.clue === 'string' && entry.clue
          ? [stringToBlock(entry.clue)]
          : Array.isArray(entry.clue)
          ? entry.clue
          : [],
      }));

    const across = mapEntries(doc.gridData.across ?? []);
    const down = mapEntries(doc.gridData.down ?? []);

    await sanityWriteClient.patch(doc._id).set({ 'gridData.across': across, 'gridData.down': down }).commit();
    migratedCount++;
  }

  return Response.json({ ok: true, migratedCount });
}
