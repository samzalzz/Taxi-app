import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateAndConsumeToken } from '@/persistence/queries/passwordResetQueries';
import { changePassword } from '@/persistence/queries/userQueries';

const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  passwordConfirm: z.string().min(1, 'Confirmation requise'),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['passwordConfirm'],
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { token, password } = ResetPasswordSchema.parse(body);

    const result = await validateAndConsumeToken(token);

    if (!result.valid) {
      const message =
        result.reason === 'expired'
          ? 'Ce lien a expiré. Veuillez faire une nouvelle demande.'
          : 'Ce lien est invalide ou déjà utilisé. Veuillez faire une nouvelle demande.';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    await changePassword(result.userId, password);

    return NextResponse.json(
      { success: true, message: 'Votre mot de passe a été réinitialisé avec succès.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
}
