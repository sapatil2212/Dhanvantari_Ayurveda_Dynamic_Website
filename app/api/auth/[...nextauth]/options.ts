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
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: true, // Enable debug mode to see detailed logs
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('🔐 NextAuth authorize called with email:', credentials?.email);
          
          if (!credentials?.email || !credentials.password) {
            console.log('❌ Missing credentials');
            return null;
          }

          // Test database connection
          await prisma.$connect();
          console.log('✅ Database connected');
          
          const user = await prisma.user.findUnique({ 
            where: { email: credentials.email.toLowerCase().trim() } 
          });
          
          if (!user) {
            console.log('❌ User not found:', credentials.email);
            return null;
          }

          console.log('✅ User found:', { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            emailVerified: !!user.emailVerified,
            isActive: user.isActive
          });

          const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
          console.log('🔑 Password match result:', passwordMatch);
          
          if (!passwordMatch) {
            console.log('❌ Password mismatch for user:', credentials.email);
            return null;
          }

          if (!user.emailVerified) {
            console.log('❌ Email not verified for user:', credentials.email);
            return null;
          }

          if (!user.isActive) {
            console.log('❌ User account is inactive:', credentials.email);
            return null;
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          });

          console.log('🎉 Authentication successful for user:', credentials.email);
          
          return { 
            id: user.id, 
            name: user.name ?? user.email, 
            email: user.email, 
            role: user.role 
          } as any;
          
        } catch (error) {
          console.error('💥 NextAuth authorize error:', error);
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
      console.log('🔄 JWT callback called:', { hasUser: !!user, hasToken: !!token });
      
      if (user) {
        token.userId = (user as any).id;
        token.role = (user as any).role;
        token.lastActivity = Date.now();
        console.log('✅ JWT callback - user logged in:', { userId: token.userId, role: token.role });
      }
      
      // Update last activity timestamp on each request
      if (token.userId) {
        token.lastActivity = Date.now();
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log('🔄 Session callback called:', { hasSession: !!session, hasToken: !!token });
      
      if (token?.userId && session.user) {
        (session.user as any).id = token.userId as string;
        (session.user as any).role = token.role as any;
        (session.user as any).lastActivity = token.lastActivity;
        console.log('✅ Session callback - session updated:', { userId: (session.user as any).id, role: (session.user as any).role });
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('🔄 NextAuth redirect called with:', { url, baseUrl });
      
      // Handle dashboard redirect
      if (url.includes('/dashboard')) {
        const redirectUrl = `${baseUrl}/dashboard`;
        console.log('🎯 Redirecting to dashboard:', redirectUrl);
        return redirectUrl;
      }
      
      // Simple redirect logic - let NextAuth handle most cases
      if (url.startsWith('/')) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log('🎯 Redirecting to relative path:', redirectUrl);
        return redirectUrl;
      }
      
      if (url.startsWith(baseUrl)) {
        console.log('🎯 Redirecting to same base URL:', url);
        return url;
      }
      
      // Default to dashboard
      const defaultUrl = `${baseUrl}/dashboard`;
      console.log('🎯 Default redirect to dashboard:', defaultUrl);
      return defaultUrl;
    },
  },
};


