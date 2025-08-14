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
  debug: true, // Enable debug for production to identify issues
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
  events: {
    async signIn({ user, account, profile }) {
      console.log('NextAuth signIn event - User:', user, 'Account:', account);
    },
    async signOut({ token, session }) {
      console.log('NextAuth signOut event - Token:', token, 'Session:', session);
    },
    async createUser({ user }) {
      console.log('NextAuth createUser event - User:', user);
    },
    async session({ session, token }) {
      console.log('NextAuth session event - Session:', session, 'Token:', token);
    },
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
      
      // On Vercel, NextAuth automatically detects the correct URL, so we use baseUrl directly
      // Don't rely on NEXTAUTH_URL in production on Vercel
      const actualBaseUrl = baseUrl;
      console.log('NextAuth redirect callback - Using baseUrl:', actualBaseUrl);
      
      // If the url is already a complete URL (has protocol), validate it
      if (url.startsWith('http://') || url.startsWith('https://')) {
        try {
          const urlObj = new URL(url);
          const baseUrlObj = new URL(actualBaseUrl);
          if (urlObj.hostname === baseUrlObj.hostname) {
            console.log('NextAuth redirect callback - Same domain URL:', url);
            return url;
          } else {
            console.log('NextAuth redirect callback - Different domain, defaulting to dashboard');
            return `${actualBaseUrl}/dashboard`;
          }
        } catch (error) {
          console.log('NextAuth redirect callback - Invalid URL, defaulting to dashboard');
          return `${actualBaseUrl}/dashboard`;
        }
      }
      
      // If it's a relative path, construct full URL
      if (url.startsWith('/')) {
        const redirectUrl = `${actualBaseUrl}${url}`;
        console.log('NextAuth redirect callback - Constructed URL from relative path:', redirectUrl);
        return redirectUrl;
      }
      
      // Default to dashboard
      const defaultUrl = `${actualBaseUrl}/dashboard`;
      console.log('NextAuth redirect callback - Default redirect to dashboard:', defaultUrl);
      return defaultUrl;
    },
  },
};


