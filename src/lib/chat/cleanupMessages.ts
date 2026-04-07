import { prisma } from '@/persistence/client';

/**
 * Deletes messages older than 30 days from the database.
 * Called fire-and-forget from API routes to avoid blocking requests.
 */
export async function deleteOldMessages() {
  try {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await prisma.message.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`[Cleanup] Deleted ${result.count} messages older than 30 days`);
    return result;
  } catch (error) {
    console.error('[Cleanup] Error deleting old messages:', error);
    throw error;
  }
}
