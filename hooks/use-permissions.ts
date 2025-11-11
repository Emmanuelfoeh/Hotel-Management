'use client';

import { useSession } from 'next-auth/react';
import { hasPermission, Permission } from '@/lib/utils/permissions';
import { StaffRole } from '@prisma/client';

export function usePermissions() {
  const { data: session } = useSession();
  const userRole = session?.user?.role as StaffRole | undefined;

  const checkPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, permission);
  };

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return permissions.some((permission) =>
      hasPermission(userRole, permission)
    );
  };

  const checkAllPermissions = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return permissions.every((permission) =>
      hasPermission(userRole, permission)
    );
  };

  return {
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    role: userRole,
    isManager: userRole === 'MANAGER',
    isReceptionist: userRole === 'RECEPTIONIST',
    isCleaner: userRole === 'CLEANER',
  };
}
