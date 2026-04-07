import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser } from '@/persistence/queries/userQueries';

const CreateAdminSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  adminSecret: z.string().min(1, 'Admin secret required'),
});

/**
 * Create the first admin user in the system
 * Requires ADMIN_SECRET environment variable for security
 * This endpoint should only be used once to bootstrap the system
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get admin secret from environment
    const ADMIN_SECRET = process.env.ADMIN_SECRET;
    if (!ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'ADMIN_SECRET not configured. Contact your system administrator.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, name, password, adminSecret } = CreateAdminSchema.parse(body);

    // Verify admin secret
    if (adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Invalid admin secret' },
        { status: 403 }
      );
    }

    // Create user with ADMIN role
    const user = await createUser(email, name, password, undefined, 'ADMIN');

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create admin' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Admin user created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    console.error('Create admin error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create admin';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
