'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  passwordConfirm: z.string().min(1, 'Confirmation requise'),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['passwordConfirm'],
});

type FormData = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return (
      <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-center space-y-3">
        <p className="text-error text-sm">Lien de réinitialisation invalide.</p>
        <Link href="/mot-de-passe-oublie" className="text-primary text-sm hover:text-primary-light transition-smooth">
          Faire une nouvelle demande
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...data }),
      });
      const result = await res.json();
      if (!res.ok) {
        setApiError(result.error ?? 'Une erreur est survenue');
        return;
      }
      router.push('/connexion?reset=success');
    } catch (_err) {
      setApiError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      {apiError && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm space-y-2">
          <p>{apiError}</p>
          <Link href="/mot-de-passe-oublie" className="text-primary hover:text-primary-light transition-smooth underline text-xs block">
            Faire une nouvelle demande
          </Link>
        </div>
      )}
      <Input
        label="Nouveau mot de passe"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        {...register('password')}
        error={errors.password?.message}
        helpText="Au moins 8 caractères"
      />
      <Input
        label="Confirmer le mot de passe"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        {...register('passwordConfirm')}
        error={errors.passwordConfirm?.message}
      />
      <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
}
