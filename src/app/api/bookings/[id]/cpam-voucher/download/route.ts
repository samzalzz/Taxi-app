import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/persistence/client';
import { generateVoucherPDF } from '@/lib/cpam/generateVoucher';

/**
 * GET /api/bookings/[id]/cpam-voucher/download
 * Download CPAM voucher as HTML/PDF
 */
export async function GET(
  __request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check authorization
    if (booking.clientId !== session.userId && booking.driverId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Generate HTML content
    const htmlContent = generateVoucherPDF(booking.cpamVoucher);

    // Return as HTML for browser display
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="bon-transport-${booking.cpamVoucher.voucherNumber}.html"`,
      },
    });
  } catch (error) {
    console.error('[Voucher Download]', error);
    return NextResponse.json(
      { error: 'Failed to generate voucher' },
      { status: 500 }
    );
  }
}
