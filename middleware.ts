import { NextResponse, type NextRequest } from 'next/server';
// This only handles early redirects; pages, APIs and actions validate sessions.
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('better-auth.session_token') || request.cookies.get('__Secure-better-auth.session_token');
  if (!cookie) return NextResponse.redirect(new URL('/sign-in', request.url));
  return NextResponse.next();
}
export const config = { matcher: ['/', '/documents/:path*'] };
