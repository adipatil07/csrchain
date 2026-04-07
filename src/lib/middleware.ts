import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const token = auth.split(' ')[1];
    const user = verifyToken(token);

    const path = req.nextUrl.pathname;

    if (path.startsWith('/ngodashboard') && user.role !== 'NGO')
      return NextResponse.redirect(new URL('/login', req.url));

    if (path.startsWith('/companydashboard') && user.role !== 'COMPANY')
      return NextResponse.redirect(new URL('/login', req.url));

    if (path.startsWith('/volunteerdashboard') && user.role !== 'VOLUNTEER')
      return NextResponse.redirect(new URL('/login', req.url));

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/ngodashboard/:path*', '/companydashboard/:path*', '/volunteerdashboard/:path*'],
};
