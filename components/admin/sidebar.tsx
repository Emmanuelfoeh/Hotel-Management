'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Bed,
  Calendar,
  Users,
  UserCog,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { StaffRole } from '@prisma/client';
import { hasAnyPermission, Permission } from '@/lib/utils/permissions';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions: Permission[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    permissions: ['bookings:read'],
  },
  {
    title: 'Rooms',
    href: '/admin/rooms',
    icon: Bed,
    permissions: ['rooms:read'],
  },
  {
    title: 'Bookings',
    href: '/admin/bookings',
    icon: Calendar,
    permissions: ['bookings:read'],
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
    permissions: ['customers:read'],
  },
  {
    title: 'Staff',
    href: '/admin/staff',
    icon: UserCog,
    permissions: ['staff:read'],
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: FileText,
    permissions: ['reports:read'],
  },
  {
    title: 'Activity Logs',
    href: '/admin/logs',
    icon: Activity,
    permissions: ['logs:read'],
  },
];

interface SidebarProps {
  userRole: StaffRole;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ userRole, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const visibleNavItems = navItems.filter((item) =>
    hasAnyPermission(userRole, item.permissions)
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="font-semibold">HMS Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              'h-8 w-8 touch-manipulation',
              isCollapsed && 'mx-auto'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2 scrollbar-hide">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start touch-manipulation min-h-[44px]',
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer - Role Badge */}
        {!isCollapsed && (
          <div className="border-t p-4">
            <div className="rounded-lg bg-muted px-3 py-2">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium capitalize">
                {userRole.toLowerCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
