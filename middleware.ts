import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Public routes that don't require authentication
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/rooms') ||
    pathname.startsWith('/gallery') ||
    pathname.startsWith('/booking') ||
    pathname.startsWith('/auth');

  // Admin routes that require authentication
  const isAdminRoute = pathname.startsWith('/admin');

  // API routes
  const isApiRoute = pathname.startsWith('/api');

  // If trying to access admin routes without being logged in
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if (isLoggedIn && pathname.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  // Role-based access control for admin routes
  if (isAdminRoute && isLoggedIn) {
    // Staff management routes - only managers
    if (pathname.startsWith('/admin/staff') && userRole !== 'MANAGER') {
      return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }

    // Reports routes - managers and receptionists
    if (
      pathname.startsWith('/admin/reports') &&
      userRole !== 'MANAGER' &&
      userRole !== 'RECEPTIONIST'
    ) {
      return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }

    // Activity logs - only managers
    if (pathname.startsWith('/admin/logs') && userRole !== 'MANAGER') {
      return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
