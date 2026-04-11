import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import {
  upsertPushSubscription,
  deletePushSubscriptionByEndpoint,
} from '@/persistence/queries/pushQueries';
import { getUserById } from '@/persistence/queries/userQueries';

const SubscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await getUserById(session.userId);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validated = SubscribeSchema.parse(body);

    await upsertPushSubscription({
      userId: session.userId,
      endpoint: validated.endpoint,
      p256dh: validated.keys.p256dh,
      auth: validated.keys.auth,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid subscription', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Push subscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { endpoint } = await request.json();
    if (typeof endpoint !== 'string') {
      return NextResponse.json({ error: 'endpoint required' }, { status: 400 });
    }
    await deletePushSubscriptionByEndpoint(endpoint);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
