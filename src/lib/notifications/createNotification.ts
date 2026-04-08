import { prisma } from '@/persistence/client';
import { NotificationType } from '@prisma/client';

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Creates a notification for a user in the database.
 * Fire-and-forget pattern: errors are logged but don't block the caller.
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  data,
}: CreateNotificationInput): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        ...(data && { data }),
      },
    });
  } catch (error) {
    // Log but don't throw - notifications are non-critical
    console.error(`[Notification] Failed to create notification for user ${userId}:`, error);
  }
}

/**
 * Creates notifications for multiple users (e.g., client + driver on status change).
 * Useful for events that affect multiple parties.
 */
export async function createNotifications(
  notifications: CreateNotificationInput[]
): Promise<void> {
  try {
    await Promise.all(
      notifications.map((notif) =>
        createNotification(notif).catch((error) => {
          // Already logged in createNotification, just ensure Promise doesn't reject
          console.error(`[Notifications] Failed to create notification:`, error);
        })
      )
    );
  } catch (error) {
    console.error(`[Notifications] Batch creation error:`, error);
  }
}
