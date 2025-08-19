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
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
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
          
          // Return minimal user data - only essential fields
          return { 
            id: user.id, 
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
      // Only store minimal essential data in JWT to keep cookie size small
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 JWT callback - User data set:', { 
            id: user.id, 
            email: user.email, 
            role: (user as any).role 
          });
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 JWT callback - Final token:', { 
          id: token.id, 
          email: token.email, 
          role: token.role 
        });
      }
      
      return token;
    },
    async session({ session, token }) {
      // Expose minimal info to client
      if (token) {
        // Ensure session.user exists
        if (!session.user) {
          session.user = {} as any;
        }
        
        (session.user as any).id = token.id as string;
        (session.user as any).email = token.email as string;
        (session.user as any).role = token.role;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 Session callback - Final session:', {
            id: (session.user as any).id,
            email: (session.user as any).email,
            role: (session.user as any).role
          });
        }
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is already a complete URL (has protocol), validate it
      if (url.startsWith('http://') || url.startsWith('https://')) {
        try {
          const urlObj = new URL(url);
          const baseUrlObj = new URL(baseUrl);
          if (urlObj.hostname === baseUrlObj.hostname) {
            return url;
          } else {
            return `${baseUrl}/dashboard`;
          }
        } catch (error) {
          return `${baseUrl}/dashboard`;
        }
      }
      
      // If it's a relative path, construct full URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Default to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};


