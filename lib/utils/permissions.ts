import { StaffRole } from '@prisma/client';

export type Permission =
  | 'rooms:create'
  | 'rooms:read'
  | 'rooms:update'
  | 'rooms:delete'
  | 'bookings:create'
  | 'bookings:read'
  | 'bookings:update'
  | 'bookings:delete'
  | 'bookings:checkin'
  | 'bookings:checkout'
  | 'customers:create'
  | 'customers:read'
  | 'customers:update'
  | 'customers:delete'
  | 'staff:create'
  | 'staff:read'
  | 'staff:update'
  | 'staff:delete'
  | 'reports:read'
  | 'reports:export'
  | 'logs:read';

export const rolePermissions: Record<StaffRole, Permission[]> = {
  MANAGER: [
    'rooms:create',
    'rooms:read',
    'rooms:update',
    'rooms:delete',
    'bookings:create',
    'bookings:read',
    'bookings:update',
    'bookings:delete',
    'bookings:checkin',
    'bookings:checkout',
    'customers:create',
    'customers:read',
    'customers:update',
    'customers:delete',
    'staff:create',
    'staff:read',
    'staff:update',
    'staff:delete',
    'reports:read',
    'reports:export',
    'logs:read',
  ],
  RECEPTIONIST: [
    'rooms:read',
    'bookings:create',
    'bookings:read',
    'bookings:update',
    'bookings:checkin',
    'bookings:checkout',
    'customers:create',
    'customers:read',
    'customers:update',
    'reports:read',
  ],
  CLEANER: ['rooms:read', 'bookings:read'],
};

export function hasPermission(
  role: StaffRole,
  permission: Permission
): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: StaffRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(
  role: StaffRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

export function canAccessRoute(role: StaffRole, route: string): boolean {
  const routePermissions: Record<string, Permission[]> = {
    '/admin/dashboard': ['bookings:read'],
    '/admin/rooms': ['rooms:read'],
    '/admin/bookings': ['bookings:read'],
    '/admin/customers': ['customers:read'],
    '/admin/staff': ['staff:read'],
    '/admin/reports': ['reports:read'],
    '/admin/logs': ['logs:read'],
  };

  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) return true;

  return hasAnyPermission(role, requiredPermissions);
}
