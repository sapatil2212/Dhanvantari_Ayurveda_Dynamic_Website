import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily disable middleware to test login flow
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};


