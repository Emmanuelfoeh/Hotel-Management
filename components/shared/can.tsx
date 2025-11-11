'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { Permission } from '@/lib/utils/permissions';

interface CanProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component for conditional rendering based on user permissions
 *
 * @example
 * <Can permission="rooms:create">
 *   <Button>Create Room</Button>
 * </Can>
 *
 * @example
 * <Can permissions={["rooms:create", "rooms:update"]} requireAll>
 *   <Button>Edit Room</Button>
 * </Can>
 */
export function Can({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
}: CanProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
