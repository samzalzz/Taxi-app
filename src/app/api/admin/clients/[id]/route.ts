import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();

    // Only allow admin and drivers to view client details
    if (!session || (session.role !== 'ADMIN' && session.role !== 'DRIVER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = params.id;

    // Fetch client with booking statistics
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        cpamByDefault: true,
        avatar: true,
        asClient: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
        reviewsReceived: {
          select: { overallRating: true },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const ratings = client.reviewsReceived.map(r => r.overallRating);
    const avgRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null;

    return NextResponse.json({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      role: client.role,
      createdAt: client.createdAt,
      cpamByDefault: client.cpamByDefault,
      avatar: client.avatar,
      completedTrips: client.asClient.length,
      rating: avgRating,
    });
  } catch (error) {
    console.error('Error fetching client details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
