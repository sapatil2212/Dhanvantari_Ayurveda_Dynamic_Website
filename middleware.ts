import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Temporarily disable middleware to test redirect flow
  // This will help us identify if middleware is causing the redirect loop
  console.log('Middleware: Temporarily disabled for testing');
  return NextResponse.next();
  
  // Original middleware code (commented out for now)
  /*
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Only protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    console.log('Middleware: Checking dashboard access for:', pathname);
    
    // Try to get the token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET
    });

    console.log('Middleware: Token found:', !!token, 'Token details:', token ? { userId: token.userId, role: token.role } : 'none');

    // If user is not authenticated, redirect to login
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      console.log('Middleware: Redirecting to login with callbackUrl:', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('Middleware: Access granted to dashboard');
  }

  // Allow the request to continue
  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};


