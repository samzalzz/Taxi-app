import webpush from 'web-push';
import {
  getAdminPushSubscriptions,
  deletePushSubscriptionByEndpoint,
} from '@/persistence/queries/pushQueries';

let configured = false;

function configure() {
  if (configured) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@taxi-leblanc.fr';

  if (!publicKey || !privateKey) {
    throw new Error('VAPID keys missing — set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY');
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export async function sendPushToAdmins(payload: PushPayload): Promise<void> {
  try {
    configure();
  } catch (err) {
    console.error('[push] configure failed:', err);
    return;
  }

  const subs = await getAdminPushSubscriptions();
  if (subs.length === 0) return;

  const body = JSON.stringify(payload);
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        // 404/410 = subscription expired, purge it
        if (statusCode === 404 || statusCode === 410) {
          await deletePushSubscriptionByEndpoint(sub.endpoint).catch(() => {});
        } else {
          console.error('[push] send failed:', err);
        }
      }
    })
  );
}
