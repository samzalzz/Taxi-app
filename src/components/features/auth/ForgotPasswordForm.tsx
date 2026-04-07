'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  email: z.string().email('Email invalide'),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setApiError(result.error ?? 'Une erreur est survenue');
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setApiError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-on-surface text-sm leading-relaxed">
          Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      {apiError && (
        <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
          {apiError}
        </div>
      )}
      <Input
        label="Adresse email"
        type="email"
        placeholder="votre@email.com"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
        Envoyer le lien de réinitialisation
      </Button>
    </form>
  );
}
