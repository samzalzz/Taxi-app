import { prisma } from '@/persistence/client';

export interface ApiUsageRecord {
  endpoint: string;
  method: string;
  count: number;
  updatedAt: string;
}

/**
 * Increment API call count for an endpoint in the current month
 * Uses upsert to avoid race conditions
 */
export async function incrementApiLog(
  endpoint: string,
  method: string
): Promise<void> {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();

  try {
    await prisma.apiLog.upsert({
      where: {
        endpoint_method_month_year: {
          endpoint,
          method,
          month,
          year,
        },
      },
      update: {
        count: { increment: 1 },
        updatedAt: new Date(),
      },
      create: {
        endpoint,
        method,
        month,
        year,
        count: 1,
      },
    });
  } catch (error) {
    // Silently fail - this is non-critical monitoring
    console.error('[ApiLog] Error incrementing API log:', error);
  }
}

/**
 * Get API usage statistics for a specific month
 */
export async function getApiUsageByMonth(
  year: number,
  month: number
): Promise<ApiUsageRecord[]> {
  const logs = await prisma.apiLog.findMany({
    where: {
      year,
      month,
    },
    orderBy: [
      { count: 'desc' },
      { endpoint: 'asc' },
      { method: 'asc' },
    ],
  });

  return logs.map(log => ({
    endpoint: log.endpoint,
    method: log.method,
    count: log.count,
    updatedAt: log.updatedAt.toISOString(),
  }));
}

/**
 * Get total API calls for the current month by endpoint
 */
export async function getTotalApiCallsThisMonth(): Promise<number> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const result = await prisma.apiLog.aggregate({
    where: {
      year,
      month,
    },
    _sum: {
      count: true,
    },
  });

  return result._sum.count || 0;
}

/**
 * Get top N endpoints by usage in current month
 */
export async function getTopApiEndpoints(
  limit: number = 10
): Promise<ApiUsageRecord[]> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const logs = await prisma.apiLog.findMany({
    where: {
      year,
      month,
    },
    orderBy: { count: 'desc' },
    take: limit,
  });

  return logs.map(log => ({
    endpoint: log.endpoint,
    method: log.method,
    count: log.count,
    updatedAt: log.updatedAt.toISOString(),
  }));
}
