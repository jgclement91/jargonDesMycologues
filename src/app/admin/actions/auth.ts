'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash } from 'crypto';

function generateSessionToken(password: string): string {
  return createHash('sha256').update(password + ':admin-session').digest('hex');
}

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get('password') as string;

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Mot de passe incorrect.' };
  }

  const token = generateSessionToken(process.env.ADMIN_PASSWORD!);
  const cookieStore = await cookies();
  cookieStore.set('admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/admin/mots-croises');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
  redirect('/admin/login');
}
