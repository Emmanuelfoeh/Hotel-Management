import { prisma } from '@/lib/db';
import { EntityType, ActionType } from '@/types';
import { Prisma } from '@prisma/client';

export interface CreateActivityLogInput {
  entityType: EntityType;
  entityId: string;
  action: ActionType;
  userId: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

export interface ActivityLogFilters {
  entityType?: EntityType;
  entityId?: string;
  action?: ActionType;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class ActivityLogService {
  /**
   * Create a new activity log entry
   */
  async createLog(data: CreateActivityLogInput) {
    return await prisma.activityLog.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        userId: data.userId,
        details: data.details
          ? (data.details as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        ipAddress: data.ipAddress,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Get activity logs with optional filters and pagination
   */
  async getLogs(
    filters?: ActivityLogFilters,
    pagination?: { page?: number; limit?: number }
  ) {
    const where: Prisma.ActivityLogWhereInput = {};

    if (filters?.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters?.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters?.action) {
      where.action = filters.action;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const query: Prisma.ActivityLogFindManyArgs = {
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    // Add pagination if provided
    if (pagination?.page && pagination?.limit) {
      query.skip = (pagination.page - 1) * pagination.limit;
      query.take = pagination.limit;
    }

    return await prisma.activityLog.findMany(query);
  }

  /**
   * Get activity logs for a specific entity
   */
  async getEntityLogs(entityType: EntityType, entityId: string) {
    return await this.getLogs({ entityType, entityId });
  }

  /**
   * Get activity logs for a specific user
   */
  async getUserLogs(userId: string) {
    return await this.getLogs({ userId });
  }

  /**
   * Get recent activity logs (last N entries)
   */
  async getRecentLogs(limit: number = 50) {
    return await prisma.activityLog.findMany({
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get count of activity logs matching filters
   */
  async getLogsCount(filters?: ActivityLogFilters) {
    const where: Prisma.ActivityLogWhereInput = {};

    if (filters?.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters?.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters?.action) {
      where.action = filters.action;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return await prisma.activityLog.count({ where });
  }

  /**
   * Delete old activity logs (for cleanup/archival)
   */
  async deleteOldLogs(olderThanDays: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return await prisma.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
  }
}

export const activityLogService = new ActivityLogService();
