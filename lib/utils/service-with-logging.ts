/**
 * Service wrapper utilities for integrating activity logging
 *
 * This file provides helper functions to wrap service calls with automatic activity logging.
 * Use these wrappers in your server actions to automatically log CRUD operations.
 *
 * Example usage in a server action:
 *
 * import { loggedCreate, loggedUpdate, loggedDelete } from '@/lib/utils/service-with-logging';
 * import { roomService } from '@/lib/services';
 *
 * export async function createRoom(data: CreateRoomInput) {
 *   const session = await requireAuth();
 *
 *   return await loggedCreate(
 *     'ROOM',
 *     session.user.id,
 *     async () => await roomService.createRoom(data),
 *     { roomData: data }
 *   );
 * }
 */

import { logActivity } from './activity-logger';
import { EntityType, ActionType } from '@/types';

/**
 * Wrapper for CREATE operations with activity logging
 */
export async function loggedCreate<T extends { id: string }>(
  entityType: EntityType,
  userId: string,
  operation: () => Promise<T>,
  details?: Record<string, any>
): Promise<T> {
  const result = await operation();

  // Log the activity asynchronously (don't block the response)
  logActivity(entityType, result.id, 'CREATE', userId, details).catch(
    (error) => {
      console.error('Failed to log CREATE activity:', error);
    }
  );

  return result;
}

/**
 * Wrapper for UPDATE operations with activity logging
 */
export async function loggedUpdate<T>(
  entityType: EntityType,
  entityId: string,
  userId: string,
  operation: () => Promise<T>,
  details?: Record<string, any>
): Promise<T> {
  const result = await operation();

  // Log the activity asynchronously
  logActivity(entityType, entityId, 'UPDATE', userId, details).catch(
    (error) => {
      console.error('Failed to log UPDATE activity:', error);
    }
  );

  return result;
}

/**
 * Wrapper for DELETE operations with activity logging
 */
export async function loggedDelete<T>(
  entityType: EntityType,
  entityId: string,
  userId: string,
  operation: () => Promise<T>,
  details?: Record<string, any>
): Promise<T> {
  const result = await operation();

  // Log the activity asynchronously
  logActivity(entityType, entityId, 'DELETE', userId, details).catch(
    (error) => {
      console.error('Failed to log DELETE activity:', error);
    }
  );

  return result;
}

/**
 * Wrapper for CHECK_IN operations with activity logging
 */
export async function loggedCheckIn<T>(
  entityId: string,
  userId: string,
  operation: () => Promise<T>,
  details?: Record<string, any>
): Promise<T> {
  const result = await operation();

  // Log the activity asynchronously
  logActivity('BOOKING', entityId, 'CHECK_IN', userId, details).catch(
    (error) => {
      console.error('Failed to log CHECK_IN activity:', error);
    }
  );

  return result;
}

/**
 * Wrapper for CHECK_OUT operations with activity logging
 */
export async function loggedCheckOut<T>(
  entityId: string,
  userId: string,
  operation: () => Promise<T>,
  details?: Record<string, any>
): Promise<T> {
  const result = await operation();

  // Log the activity asynchronously
  logActivity('BOOKING', entityId, 'CHECK_OUT', userId, details).catch(
    (error) => {
      console.error('Failed to log CHECK_OUT activity:', error);
    }
  );

  return result;
}

/**
 * Generic wrapper for any action type
 */
export async function loggedAction<T>(
  entityType: EntityType,
  entityId: string,
  action: ActionType,
  userId: string,
  operation: () => Promise<T>,
  details?: Record<string, any>
): Promise<T> {
  const result = await operation();

  // Log the activity asynchronously
  logActivity(entityType, entityId, action, userId, details).catch((error) => {
    console.error(`Failed to log ${action} activity:`, error);
  });

  return result;
}
