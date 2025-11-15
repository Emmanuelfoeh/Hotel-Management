import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { StaffRole } from '@prisma/client';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: StaffRole;
      firstName: string;
      lastName: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    role: StaffRole;
    firstName: string;
    lastName: string;
    isActive: boolean;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: StaffRole;
    firstName: string;
    lastName: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const staff = await prisma.staff.findUnique({
            where: { email: credentials.email as string },
          });

          if (!staff) {
            return null;
          }

          if (!staff.isActive) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            staff.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: staff.id,
            email: staff.email,
            role: staff.role,
            firstName: staff.firstName,
            lastName: staff.lastName,
            isActive: staff.isActive,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },
  },
});
