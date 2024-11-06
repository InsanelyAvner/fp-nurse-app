import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/login', '/register'];
const NURSE_ROUTES = ['/nurse/dashboard'];

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - static files
     * - image files
     * - favicon
     * - public images
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images/).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if current route is public
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token');

  // 2. No token -> redirect to login (only for protected routes)
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Verify token
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret);
    const user = payload.user as { role: string };

    if (pathname == '/') {
      if (user.role == 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/nurse/dashboard', request.url));
      }
    }

    // 4. Check admin access
    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/nurse/dashboard', request.url));
    }

    if (pathname.startsWith('/nurse') && user.role == 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } // Added closing brace here

    return NextResponse.next();
  } catch (error) {
    // 5. Invalid token -> clear and redirect
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}
