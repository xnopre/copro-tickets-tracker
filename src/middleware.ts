import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

export const middleware = withAuth(
  function middleware(req: NextRequest & { nextauth: any }) {
    const isLoggedIn = !!req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Routes publiques (sans authentification requise)
    const publicRoutes = ['/login', '/robots.txt'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Routes protégées (authentification requise)
    const protectedRoutes = ['/', '/tickets', '/api'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Rediriger vers login si pas authentifié et route protégée
    if (!isLoggedIn && isProtectedRoute && !isPublicRoute) {
      const loginUrl = new URL('/login', req.nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return Response.redirect(loginUrl);
    }

    // Rediriger vers home si authentifié et essaie d'accéder à /login
    if (isLoggedIn && pathname === '/login') {
      return Response.redirect(new URL('/', req.nextUrl.origin));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Autoriser les routes publiques même sans token
        const publicRoutes = ['/login', '/robots.txt'];
        const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));

        if (isPublicRoute) {
          return true;
        }

        // Routes protégées : requièrent un token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
