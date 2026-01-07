import { type NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { ServiceFactory } from './application/services/ServiceFactory';
import connectDB from './infrastructure/database/mongodb';
import { logger } from '@/infrastructure/services/logger';

const credentialsSchema = z.object({
  email: z.string().email('Format email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validation = credentialsSchema.safeParse(credentials);
        if (!validation.success) {
          logger.warn('Invalid credentials format', {
            errors: validation.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message,
            })),
          });
          return null;
        }

        try {
          await connectDB();
          const authService = ServiceFactory.getAuthService();
          const user = await authService.validateCredentials(
            validation.data.email,
            validation.data.password
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
};

export const auth = () => getServerSession(authOptions);
export { signIn, signOut } from 'next-auth/react';
