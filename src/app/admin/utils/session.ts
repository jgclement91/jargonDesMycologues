import { cookies } from 'next/headers';
import { createHash } from 'crypto';

export async function getIsAdmin(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const expected = createHash('sha256').update(process.env.ADMIN_PASSWORD + ':admin-session').digest('hex');
  const cookieStore = await cookies();
  return cookieStore.get('admin-session')?.value === expected;
}
