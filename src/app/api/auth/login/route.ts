import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByEmail, verifyPassword } from '@/persistence/queries/userQueries';
import { signToken } from '@/lib/auth/jwt';
import { checkRateLimit, getRemainingAttempts } from '@/lib/auth/rateLimit';

const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit (max 5 attempts per 15 minutes)
    if (!checkRateLimit(ip, { maxAttempts: 5, windowMs: 15 * 60 * 1000 })) {
      return NextResponse.json(
        {
          error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
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
    const data = LoginSchema.parse(body);

    // Find user
    const user = await getUserByEmail(data.email);
    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      data.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Sign JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user without passwordHash
    const { passwordHash, ...userWithoutPassword } = user;

    // Create response with JSON body
    const response = NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
        token,
      },
      { status: 200 }
    );

    // Set httpOnly cookie directly on response
    response.cookies.set('auth-session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
}
