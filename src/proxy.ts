import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function generateSessionToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + ':admin-session');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin-session');
    const expectedToken = await generateSessionToken(process.env.ADMIN_PASSWORD!);

    if (!sessionCookie || sessionCookie.value !== expectedToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
