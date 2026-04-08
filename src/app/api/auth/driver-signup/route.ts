import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, getUserByEmail } from '@/persistence/queries/userQueries';
import { createDriver, createVehicle } from '@/persistence/queries/driverQueries';
import { signToken } from '@/lib/auth/jwt';
import { VehicleType } from '@prisma/client';

const DriverSignupSchema = z.object({
  // Personal info
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  phone: z.string().optional(),
  // License info
  licenseNumber: z.string().min(1),
  licenseExpiryDate: z.string().datetime().refine(
    (date) => new Date(date) > new Date(),
    'License expiry date must be in the future'
  ),
  // Vehicle info
  vehicleType: z.enum(['BERLINE', 'SUV', 'VAN', 'PREMIUM'] as const),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(2000),
  color: z.string().min(1),
  plateNumber: z.string().min(1),
  capacity: z.number().int().min(1).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validated = DriverSignupSchema.parse(body);

    // Check email doesn't already exist
    const existing = await getUserByEmail(validated.email);
    if (existing) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Create user with DRIVER role
    const user = await createUser(
      validated.email,
      validated.name,
      validated.password,
      validated.phone,
      'DRIVER'
    );

    // Create driver record
    const driver = await createDriver(user.id, {
      licenseNumber: validated.licenseNumber,
      licenseExpiryDate: new Date(validated.licenseExpiryDate),
    });

    // Create vehicle record
    const vehicle = await createVehicle(driver.id, {
      type: validated.vehicleType as VehicleType,
      brand: validated.brand,
      model: validated.model,
      year: validated.year,
      color: validated.color,
      plateNumber: validated.plateNumber,
      capacity: validated.capacity || 4,
    });

    // Link vehicle to driver by updating vehicleId
    const { prisma: dbClient } = await import('@/persistence/client');
    await dbClient.driver.update({
      where: { id: driver.id },
      data: { vehicleId: vehicle.id },
    });

    // Mint JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set session cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Set cookie (only secure flag if accessing via HTTPS)
    const isHttps = request.headers.get('x-forwarded-for-proto') === 'https' ||
                    request.url.startsWith('https://');

    response.cookies.set('auth-session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      secure: isHttps,
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Driver signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
