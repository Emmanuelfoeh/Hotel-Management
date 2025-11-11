import { activityLogService } from '@/lib/services';
import { EntityType, ActionType } from '@/types';
import { headers } from 'next/headers';

/**
 * Helper function to get client IP address from headers
 */
export async function getClientIp(): Promise<string | undefined> {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return realIp || undefined;
}

/**
 * Log an activity
 */
export async function logActivity(
  entityType: EntityType,
  entityId: string,
  action: ActionType,
  userId: string,
  details?: Record<string, any>
) {
  try {
    const ipAddress = await getClientIp();

    await activityLogService.createLog({
      entityType,
      entityId,
      action,
      userId,
      details,
      ipAddress,
    });
  } catch (error) {
    // Log error but don't throw - activity logging should not break the main operation
    console.error('Failed to log activity:', error);
  }
}

/**
 * Wrapper function to log CRUD operations
 * Usage: await withActivityLog(entityType, entityId, action, userId, details, async () => { ... })
 */
export async function withActivityLog<T>(
  entityType: EntityType,
  entityId: string,
  action: ActionType,
  userId: string,
  details: Record<string, any> | undefined,
  operation: () => Promise<T>
): Promise<T> {
  // Execute the operation first
  const result = await operation();

  // Log the activity (don't await to avoid blocking)
  logActivity(entityType, entityId, action, userId, details).catch((error) => {
    console.error('Failed to log activity:', error);
  });

  return result;
}

/**
 * Create a logging decorator for service methods
 */
export function createActivityLogger(
  entityType: EntityType,
  action: ActionType
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      // Extract entityId and userId from result or args
      // This is a basic implementation - adjust based on your needs
      const entityId = result?.id || args[0];
      const userId = args[args.length - 1]?.userId;

      if (entityId && userId) {
        logActivity(entityType, entityId, action, userId).catch((error) => {
          console.error('Failed to log activity:', error);
        });
      }

      return result;
    };

    return descriptor;
  };
}
