import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and public auth routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/auth/')
  ) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    try {
      // Try multiple approaches to get the token
      let token = null;
      
      // First, try with default settings
      token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
      });

      // If no token found, try with different cookie names
      if (!token) {
        token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
          secureCookie: false,
          cookieName: 'next-auth.session-token'
        });
      }

      // If still no token, try with secure cookie
      if (!token) {
        token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
          secureCookie: true,
          cookieName: '__Secure-next-auth.session-token'
        });
      }

      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Middleware - Checking auth for:', pathname);
        console.log('🔐 Middleware - Token exists:', !!token);
        console.log('🔐 Middleware - Token ID:', token?.id);
        console.log('🔐 Middleware - Token email:', token?.email);
        console.log('🔐 Middleware - Token role:', token?.role);
        
        // Log all cookies for debugging
        const cookies = request.headers.get('cookie');
        console.log('🔐 Middleware - All cookies:', cookies);
      }

      // Check if user is authenticated - be more lenient with token validation
      if (!token) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 Middleware - No token found, redirecting to login');
        }
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // User is authenticated
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Middleware - User authenticated, allowing access to:', pathname);
      }
      return NextResponse.next();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🔐 Middleware error:', error);
      }
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
