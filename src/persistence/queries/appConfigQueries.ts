import { prisma } from '@/persistence/client';

export interface AppConfigUpdate {
  googleMapsApiKey?: string;
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  appName?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  bookingConfirmationSubject?: string;
  bookingConfirmationBody?: string;
  bookingEmailSignature?: string;
}

/**
 * Get app configuration (singleton)
 */
export async function getAppConfig() {
  let config = await prisma.appConfig.findFirst();

  // Create default config if it doesn't exist
  if (!config) {
    config = await prisma.appConfig.create({
      data: {
        appName: 'Taxi Leblanc',
      },
    });
  }

  return config;
}

/**
 * Update app configuration
 */
export async function updateAppConfig(data: AppConfigUpdate) {
  const config = await getAppConfig();

  return prisma.appConfig.update({
    where: { id: config.id },
    data,
  });
}

/**
 * Get Google Maps API key (public-safe)
 */
export async function getGoogleMapsApiKey() {
  const config = await getAppConfig();
  return config.googleMapsApiKey;
}

/**
 * Get booking confirmation email template
 */
export async function getEmailTemplate() {
  const config = await getAppConfig();
  return {
    subject: config.bookingConfirmationSubject,
    body: config.bookingConfirmationBody,
    signature: config.bookingEmailSignature,
  };
}
