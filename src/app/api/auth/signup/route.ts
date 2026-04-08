import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, getUserByEmail } from '@/persistence/queries/userQueries';
import { signToken } from '@/lib/auth/jwt';
import { setSessionCookie } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rateLimit';
import { logApiCall } from '@/lib/api/logApiCall';

const SignupSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Log API call
    logApiCall('/api/auth/signup', 'POST');

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit (max 10 signup attempts per 15 minutes)
    if (!checkRateLimit(ip, { maxAttempts: 10, windowMs: 15 * 60 * 1000 })) {
      return NextResponse.json(
        {
          error: 'Trop de tentatives d\'inscription. Veuillez réessayer dans 15 minutes.'
        },
        {
          status: 429,
          headers: {
            'Retry-After': '900', // 15 minutes in seconds
          }
        }
      );
    }

    const body = await request.json();
    const data = SignupSchema.parse(body);

    // Check if user already exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser(
      data.email,
      data.name,
      data.password,
      data.phone
    );

    // Sign JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set session cookie
    await setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        user,
        token,
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

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}
