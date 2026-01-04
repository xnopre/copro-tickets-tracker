import { auth } from '@/auth';

export const middleware = auth(req => {
  const isLoggedIn = !!req.auth;
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
});

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
