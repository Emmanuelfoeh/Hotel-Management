'use server';

import { activityLogService } from '@/lib/services';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { EntityType, ActionType } from '@/types';
import { revalidatePath } from 'next/cache';

/**
 * Get activity logs with filters and pagination
 */
export async function getActivityLogs(
  filters?: {
    entityType?: EntityType;
    entityId?: string;
    action?: ActionType;
    userId?: string;
    startDate?: string;
    endDate?: string;
  },
  pagination?: {
    page?: number;
    limit?: number;
  }
) {
  try {
    await requireAuth();

    const parsedFilters = filters
      ? {
          ...filters,
          startDate: filters.startDate
            ? new Date(filters.startDate)
            : undefined,
          endDate: filters.endDate ? new Date(filters.endDate) : undefined,
        }
      : undefined;

    const logs = await activityLogService.getLogs(parsedFilters, pagination);

    return {
      success: true,
      data: logs,
    };
  } catch (error) {
    console.error('Failed to get activity logs:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get activity logs',
    };
  }
}

/**
 * Get activity logs for a specific entity
 */
export async function getEntityActivityLogs(
  entityType: EntityType,
  entityId: string
) {
  try {
    await requireAuth();

    const logs = await activityLogService.getEntityLogs(entityType, entityId);

    return {
      success: true,
      data: logs,
    };
  } catch (error) {
    console.error('Failed to get entity activity logs:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get entity activity logs',
    };
  }
}

/**
 * Get recent activity logs
 */
export async function getRecentActivityLogs(limit: number = 50) {
  try {
    await requireAuth();

    const logs = await activityLogService.getRecentLogs(limit);

    return {
      success: true,
      data: logs,
    };
  } catch (error) {
    console.error('Failed to get recent activity logs:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get recent activity logs',
    };
  }
}

/**
 * Delete old activity logs (admin only)
 */
export async function deleteOldActivityLogs(olderThanDays: number) {
  try {
    const session = await requireAuth();

    // Only managers can delete logs
    if (session.user.role !== 'MANAGER') {
      return {
        success: false,
        error: 'Unauthorized: Only managers can delete activity logs',
      };
    }

    const result = await activityLogService.deleteOldLogs(olderThanDays);

    revalidatePath('/admin/logs');

    return {
      success: true,
      data: { count: result.count },
    };
  } catch (error) {
    console.error('Failed to delete old activity logs:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete old activity logs',
    };
  }
}
