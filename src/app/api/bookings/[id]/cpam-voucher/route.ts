import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { createCpamVoucher } from '@/lib/cpam/generateVoucher';

/**
 * GET /api/bookings/[id]/cpam-voucher
 * Get CPAM voucher for a booking
 */
export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        cpamVoucher: true,
        driver: { include: { vehicle: true } },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (booking.clientId !== session.userId && booking.driverId !== session.userId) {
      // Admin check would go here
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    if (!booking.isCpam) {
      return NextResponse.json(
        { error: 'This booking is not a CPAM booking' },
        { status: 400 }
      );
    }

    // Return existing voucher or null
    return NextResponse.json({ voucher: booking.cpamVoucher });
  } catch (error) {
    console.error('[Voucher GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch voucher' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings/[id]/cpam-voucher
 * Create CPAM voucher for a booking
 */
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        cpamVoucher: true,
        driver: { include: { user: true, vehicle: true } },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check authorization (only client or driver)
    if (booking.clientId !== session.userId && booking.driverId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    if (!booking.isCpam) {
      return NextResponse.json(
        { error: 'This booking is not a CPAM booking' },
        { status: 400 }
      );
    }

    // Check if voucher already exists
    if (booking.cpamVoucher) {
      return NextResponse.json({ voucher: booking.cpamVoucher });
    }

    // Booking must be completed
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Booking must be completed to create a voucher' },
        { status: 400 }
      );
    }

    // Get request body for additional info
    const body = await request.json();

    // Create the voucher
    const voucher = await createCpamVoucher(booking);

    // Update with additional info if provided
    if (body.prescriptionRef || body.patientName || body.cpamOrganism) {
      const updated = await prisma.cpamTransportVoucher.update({
        where: { id: voucher.id },
        data: {
          prescriptionRef: body.prescriptionRef || voucher.prescriptionRef,
          patientName: body.patientName || voucher.patientName,
          cpamOrganism: body.cpamOrganism || voucher.cpamOrganism,
        },
      });
      return NextResponse.json({ voucher: updated }, { status: 201 });
    }

    return NextResponse.json({ voucher }, { status: 201 });
  } catch (error) {
    console.error('[Voucher POST]', error);
    return NextResponse.json(
      { error: 'Failed to create voucher' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/bookings/[id]/cpam-voucher
 * Update CPAM voucher details
 */
export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { cpamVoucher: true },
    });

    if (!booking?.cpamVoucher) {
      return NextResponse.json(
        { error: 'Voucher not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updated = await prisma.cpamTransportVoucher.update({
      where: { id: booking.cpamVoucher.id },
      data: {
        prescriptionRef: body.prescriptionRef ?? undefined,
        patientName: body.patientName ?? undefined,
        cpamOrganism: body.cpamOrganism ?? undefined,
        status: body.status ?? undefined,
      },
    });

    return NextResponse.json({ voucher: updated });
  } catch (error) {
    console.error('[Voucher PATCH]', error);
    return NextResponse.json(
      { error: 'Failed to update voucher' },
      { status: 500 }
    );
  }
}
