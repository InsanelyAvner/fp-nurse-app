import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/', '/profile', '/jobs', '/job-search'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET); 
      await jwtVerify(token.value, secret);
    } catch (error) {
      console.error('Token verification failed:', error);
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['//:path*', '/profile/:path*', '/jobs/:path*', '/job-search/:path*'],
};
