'use client';

import { useCallback, useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return output;
}

export type PushSupport =
  | 'checking'
  | 'unsupported'
  | 'needs-pwa-install'
  | 'ready';

export interface UsePushNotificationsResult {
  support: PushSupport;
  permission: NotificationPermission | 'default';
  isSubscribed: boolean;
  isBusy: boolean;
  error: string | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsResult {
  const [support, setSupport] = useState<PushSupport>('checking');
  const [permission, setPermission] = useState<NotificationPermission | 'default'>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect support + current state
  useEffect(() => {
    const detect = async () => {
      if (typeof window === 'undefined') return;

      const hasSW = 'serviceWorker' in navigator;
      const hasPush = 'PushManager' in window;
      const hasNotif = 'Notification' in window;

      if (!hasSW || !hasPush || !hasNotif) {
        setSupport('unsupported');
        return;
      }

      // iOS Safari only supports web push from a standalone (home-screen) PWA.
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        // @ts-expect-error iOS-specific property
        window.navigator.standalone === true;

      if (isIOS && !isStandalone) {
        setSupport('needs-pwa-install');
        return;
      }

      setPermission(Notification.permission);

      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        setIsSubscribed(!!existing);
      } catch {
        /* ignore */
      }
      setSupport('ready');
    };

    detect();
  }, []);

  const subscribe = useCallback(async () => {
    setIsBusy(true);
    setError(null);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        throw new Error('Permission refusée');
      }

      const keyRes = await fetch('/api/push/vapid-public-key');
      if (!keyRes.ok) throw new Error('Clé VAPID indisponible');
      const { publicKey } = await keyRes.json();

      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
        });
      }

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sub.toJSON()),
      });
      if (!res.ok) throw new Error('Enregistrement serveur échoué');

      setIsSubscribed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsBusy(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setIsBusy(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsBusy(false);
    }
  }, []);

  return { support, permission, isSubscribed, isBusy, error, subscribe, unsubscribe };
}
