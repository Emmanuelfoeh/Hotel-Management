import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { StaffRole } from '@prisma/client';
import { hasPermission, Permission } from './permissions';

/**
 * Get the current authenticated user session
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return session;
}

/**
 * Get the current authenticated user session
 * Returns null if not authenticated (doesn't redirect)
 */
export async function getSession() {
  return await auth();
}

/**
 * Check if user has a specific role
 * Redirects to unauthorized page if not
 */
export async function requireRole(allowedRoles: StaffRole[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role)) {
    redirect('/admin/unauthorized');
  }

  return session;
}

/**
 * Check if user has a specific permission
 * Redirects to unauthorized page if not
 */
export async function requirePermission(permission: Permission) {
  const session = await requireAuth();

  if (!hasPermission(session.user.role, permission)) {
    redirect('/admin/unauthorized');
  }

  return session;
}

/**
 * Check if user has any of the specified permissions
 * Redirects to unauthorized page if not
 */
export async function requireAnyPermission(permissions: Permission[]) {
  const session = await requireAuth();

  const hasAny = permissions.some((permission) =>
    hasPermission(session.user.role, permission)
  );

  if (!hasAny) {
    redirect('/admin/unauthorized');
  }

  return session;
}

/**
 * Check if current user is a manager
 */
export async function isManager() {
  const session = await getSession();
  return session?.user?.role === 'MANAGER';
}

/**
 * Check if current user is a receptionist
 */
export async function isReceptionist() {
  const session = await getSession();
  return session?.user?.role === 'RECEPTIONIST';
}

/**
 * Check if current user is a cleaner
 */
export async function isCleaner() {
  const session = await getSession();
  return session?.user?.role === 'CLEANER';
}
