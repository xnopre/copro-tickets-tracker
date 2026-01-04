import type { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    firstName: string;
    lastName: string;
  }
}
