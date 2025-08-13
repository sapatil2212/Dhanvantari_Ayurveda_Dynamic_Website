import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Simple in-memory rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetTime: number; blockedUntil?: number }>();

function isLoginRateLimited(identifier: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);
  
  if (!attempt) {
    loginAttempts.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return false;
  }
  
  // Check if account is temporarily blocked
  if (attempt.blockedUntil && now < attempt.blockedUntil) {
    return true;
  }
  
  if (now > attempt.resetTime) {
    loginAttempts.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return false;
  }
  
  // Block after 5 failed attempts for 30 minutes
  if (attempt.count >= 5) {
    attempt.blockedUntil = now + 30 * 60 * 1000; // 30 minutes
    return true;
  }
  
  attempt.count++;
  return false;
}

function resetLoginAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const email = credentials.email.toLowerCase().trim();
          
          // Check rate limiting
          if (isLoginRateLimited(email)) {
            throw new Error('RATE_LIMIT_EXCEEDED');
          }

          // Test database connection
          await prisma.$connect();
          
          const user = await prisma.user.findUnique({ 
            where: { email } 
          });
          
          if (!user) {
            throw new Error('USER_NOT_FOUND');
          }

          // Check if account is active
          if (!user.isActive) {
            throw new Error('ACCOUNT_DISABLED');
          }

          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error('EMAIL_NOT_VERIFIED');
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
          
          if (!passwordMatch) {
            throw new Error('CredentialsSignin');
          }

          // Reset login attempts on successful login
          resetLoginAttempts(email);

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          });
          
          return { 
            id: user.id, 
            name: user.name ?? user.email, 
            email: user.email, 
            role: user.role 
          } as any;
          
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('NextAuth authorize error:', error);
          }
          
          // Re-throw specific errors to be handled by the client
          if (error instanceof Error) {
            throw error;
          }
          
          return null;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('NextAuth JWT callback - User:', user, 'Token:', token);
      
      if (user) {
        token.userId = (user as any).id;
        token.role = (user as any).role;
        token.lastActivity = Date.now();
        console.log('NextAuth JWT callback - Updated token with user data:', token);
      } else {
        console.log('NextAuth JWT callback - No user provided, keeping existing token');
      }
      
      // Update last activity timestamp on each request
      if (token.userId) {
        token.lastActivity = Date.now();
      }
      
      console.log('NextAuth JWT callback - Final token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('NextAuth session callback - Token:', token, 'Session:', session);
      
      if (token?.userId && session.user) {
        (session.user as any).id = token.userId as string;
        (session.user as any).role = token.role as any;
        (session.user as any).lastActivity = token.lastActivity;
        console.log('NextAuth session callback - Updated session:', session);
      } else {
        console.log('NextAuth session callback - No token.userId or session.user');
      }
      
      // Ensure session has required fields
      if (!session.user) {
        console.log('NextAuth session callback - No session.user, creating default');
        session.user = {
          id: token?.userId as string || '',
          email: token?.email as string || '',
          name: token?.name as string || '',
          role: token?.role as any || 'USER',
        } as any;
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('NextAuth redirect callback - URL:', url, 'Base URL:', baseUrl);
      
      // Get the actual base URL from the request
      const actualBaseUrl = process.env.NEXTAUTH_URL || baseUrl || 'http://localhost:3001';
      console.log('NextAuth redirect callback - Actual base URL:', actualBaseUrl);
      
      // Handle dashboard redirect
      if (url.includes('/dashboard')) {
        const redirectUrl = `${actualBaseUrl}/dashboard`;
        console.log('NextAuth redirect callback - Redirecting to dashboard:', redirectUrl);
        return redirectUrl;
      }
      
      // Handle auth/login redirects
      if (url.includes('/auth/login')) {
        console.log('NextAuth redirect callback - Staying on login page');
        return url;
      }
      
      // Handle relative paths
      if (url.startsWith('/')) {
        const redirectUrl = `${actualBaseUrl}${url}`;
        console.log('NextAuth redirect callback - Redirecting to relative path:', redirectUrl);
        return redirectUrl;
      }
      
      // Handle absolute URLs with same base
      if (url.startsWith(actualBaseUrl)) {
        console.log('NextAuth redirect callback - URL already has base URL:', url);
        return url;
      }
      
      // Handle external URLs (security check)
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // Only allow redirects to the same domain
        try {
          const urlObj = new URL(url);
          const baseUrlObj = new URL(actualBaseUrl);
          if (urlObj.hostname === baseUrlObj.hostname) {
            console.log('NextAuth redirect callback - Allowing external URL to same domain:', url);
            return url;
          }
        } catch (error) {
          console.log('NextAuth redirect callback - Invalid URL, defaulting to dashboard');
        }
      }
      
      // Default to dashboard
      const defaultUrl = `${actualBaseUrl}/dashboard`;
      console.log('NextAuth redirect callback - Default redirect to dashboard:', defaultUrl);
      return defaultUrl;
    },
  },
};


