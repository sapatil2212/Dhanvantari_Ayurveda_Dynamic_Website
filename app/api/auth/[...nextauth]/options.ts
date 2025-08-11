import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
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
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId && session.user) {
        (session.user as any).id = token.userId as string;
        (session.user as any).role = token.role as any;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch {
        // ignore invalid absolute URL
      }
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};


