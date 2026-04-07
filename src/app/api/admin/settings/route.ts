import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAppConfig, updateAppConfig, AppConfigUpdate } from '@/persistence/queries/appConfigQueries';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  googleMapsApiKey: z.string().optional(),
  stripePublishableKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  appName: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().optional(),
  bookingConfirmationSubject: z.string().min(1).optional(),
  bookingConfirmationBody: z.string().min(1).optional(),
  bookingEmailSignature: z.string().optional(),
});

export async function GET(_: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const config = await getAppConfig();

    // Don't expose secret keys in response
    return NextResponse.json({
      id: config.id,
      appName: config.appName,
      googleMapsApiKey: config.googleMapsApiKey ? '•••••••••••••••••' : null,
      stripePublishableKey: config.stripePublishableKey ? '•••••••••••••••••' : null,
      maintenanceMode: config.maintenanceMode,
      maintenanceMessage: config.maintenanceMessage,
      bookingConfirmationSubject: config.bookingConfirmationSubject,
      bookingConfirmationBody: config.bookingConfirmationBody,
      bookingEmailSignature: config.bookingEmailSignature,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateSettingsSchema.parse(body);

    const config = await updateAppConfig(validatedData as AppConfigUpdate);

    // Don't expose secret keys in response
    return NextResponse.json({
      id: config.id,
      appName: config.appName,
      googleMapsApiKey: config.googleMapsApiKey ? '•••••••••••••••••' : null,
      stripePublishableKey: config.stripePublishableKey ? '•••••••••••••••••' : null,
      maintenanceMode: config.maintenanceMode,
      maintenanceMessage: config.maintenanceMessage,
      bookingConfirmationSubject: config.bookingConfirmationSubject,
      bookingConfirmationBody: config.bookingConfirmationBody,
      bookingEmailSignature: config.bookingEmailSignature,
      message: 'Paramètres mis à jour avec succès',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Settings PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
