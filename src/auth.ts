import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { ServiceFactory } from './application/services/ServiceFactory';
import connectDB from './infrastructure/database/mongodb';
import { logger } from '@/infrastructure/services/logger';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          const authService = ServiceFactory.getAuthService();
          const user = await authService.validateCredentials(
            credentials.email as string,
            credentials.password as string
          );

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } catch (error) {
          logger.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.firstName = String(token.firstName);
        session.user.lastName = String(token.lastName);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
