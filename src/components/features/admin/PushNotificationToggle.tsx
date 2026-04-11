'use client';

import { Bell, BellOff, Smartphone, AlertCircle } from 'lucide-react';
import { usePushNotifications } from '@/lib/hooks/usePushNotifications';
import { Button } from '@/components/ui/Button';

export function PushNotificationToggle() {
  const { support, permission, isSubscribed, isBusy, error, subscribe, unsubscribe } =
    usePushNotifications();

  if (support === 'checking') return null;

  if (support === 'unsupported') {
    return (
      <div className="p-4 rounded-lg border border-on-surface/10 bg-surface">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-on-surface-dim flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-on-surface">Notifications indisponibles</p>
            <p className="text-xs text-on-surface-dim mt-1">
              Votre navigateur ne supporte pas les notifications push.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (support === 'needs-pwa-install') {
    return (
      <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-on-surface">
              Installez l&apos;app pour activer les notifications
            </p>
            <ol className="text-xs text-on-surface-dim mt-2 space-y-1 list-decimal list-inside">
              <li>Appuyez sur le bouton Partager dans Safari</li>
              <li>Choisissez « Sur l&apos;écran d&apos;accueil »</li>
              <li>Ouvrez Taxi Leblanc depuis l&apos;icône ajoutée</li>
              <li>Revenez ici pour activer les notifications</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  const blocked = permission === 'denied';

  return (
    <div className="p-4 rounded-lg border border-on-surface/10 bg-surface">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {isSubscribed ? (
            <Bell className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          ) : (
            <BellOff className="w-5 h-5 text-on-surface-dim flex-shrink-0 mt-0.5" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-on-surface">
              Notifications push admin
            </p>
            <p className="text-xs text-on-surface-dim mt-1">
              {isSubscribed
                ? 'Activées sur cet appareil — vous recevrez une alerte à chaque nouvelle course.'
                : blocked
                  ? 'Bloquées dans les réglages de votre navigateur. Réautorisez-les pour continuer.'
                  : 'Recevez une alerte instantanée à chaque nouvelle réservation.'}
            </p>
            {error && <p className="text-xs text-error mt-2">{error}</p>}
          </div>
        </div>
        <div className="flex-shrink-0">
          {isSubscribed ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={unsubscribe}
              isLoading={isBusy}
            >
              Désactiver
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={subscribe}
              isLoading={isBusy}
              disabled={blocked}
            >
              Activer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
