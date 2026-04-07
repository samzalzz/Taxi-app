import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByEmail } from '@/persistence/queries/userQueries';
import { createPasswordResetToken } from '@/persistence/queries/passwordResetQueries';
import { sendPasswordResetEmail } from '@/lib/email/mailer';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

const SUCCESS_RESPONSE = NextResponse.json(
  { success: true, message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.' },
  { status: 200 }
);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email } = ForgotPasswordSchema.parse(body);

    const user = await getUserByEmail(email);

    // Always return 200 to prevent email enumeration
    if (!user) return SUCCESS_RESPONSE;

    const rawToken = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail(email, rawToken);

    return SUCCESS_RESPONSE;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Forgot password error:', error);
    // Still return 200 to avoid leaking error signals to an attacker
    return SUCCESS_RESPONSE;
  }
}
