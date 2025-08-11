import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: { 
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 hours maximum
    updateAge: 10 * 60, // 10 minutes - update session activity
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
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          throw new Error('USER_NOT_FOUND');
        }

        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;

        if (!user.emailVerified) {
          // Throw a known error message used by client UI
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        return { id: user.id, name: user.name ?? user.email, email: user.email, role: user.role } as any;
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = (user as any).id;
        token.role = (user as any).role;
        token.lastActivity = Date.now();
        console.log('JWT callback - user logged in:', { userId: token.userId, role: token.role });
      }
      
      // Check if token is expired based on last activity
      const now = Date.now();
      const lastActivity = token.lastActivity as number || now;
      const inactivityTimeout = 10 * 60 * 1000; // 10 minutes
      
      if (now - lastActivity > inactivityTimeout) {
        // Token is expired due to inactivity
        return null;
      }
      
      // Update last activity timestamp
      token.lastActivity = now;
      return token;
    },
    async session({ session, token }) {
      if (token?.userId && session.user) {
        (session.user as any).id = token.userId as string;
        (session.user as any).role = token.role as any;
        (session.user as any).lastActivity = token.lastActivity;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after successful login
      if (url === baseUrl || url === `${baseUrl}/auth/login`) {
        return `${baseUrl}/dashboard`;
      }
      
      // Handle callback URLs
      if (url.includes('callbackUrl')) {
        const callbackUrl = new URLSearchParams(url.split('?')[1] || '').get('callbackUrl');
        if (callbackUrl && callbackUrl.startsWith('/')) {
          return `${baseUrl}${callbackUrl}`;
        }
      }
      
      // Handle relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Handle same origin URLs
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          return url;
        }
      } catch {
        // ignore invalid URLs
      }
      
      // Default to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
};


