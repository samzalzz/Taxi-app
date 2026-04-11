import { prisma } from '@/persistence/client';

export async function upsertPushSubscription(params: {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
}) {
  return prisma.pushSubscription.upsert({
    where: { endpoint: params.endpoint },
    create: params,
    update: {
      userId: params.userId,
      p256dh: params.p256dh,
      auth: params.auth,
      userAgent: params.userAgent,
    },
  });
}

export async function deletePushSubscriptionByEndpoint(endpoint: string) {
  return prisma.pushSubscription.deleteMany({ where: { endpoint } });
}

export async function getAdminPushSubscriptions() {
  return prisma.pushSubscription.findMany({
    where: { user: { role: 'ADMIN' } },
  });
}
