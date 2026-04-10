'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const signupSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  phone: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || 'Erreur d\'inscription');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setApiError('Une erreur est survenue');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      {apiError && (
        <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
          {apiError}
        </div>
      )}

      <Input
        label="Nom complet"
        type="text"
        placeholder="Jean Dupont"
        autoComplete="name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Email"
        type="email"
        placeholder="votre@email.com"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Numéro de téléphone (optionnel)"
        type="tel"
        placeholder="+33 6 12 34 56 78"
        autoComplete="tel"
        {...register('phone')}
        error={errors.phone?.message}
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        helpText="Au moins 8 caractères"
        autoComplete="new-password"
        {...register('password')}
        error={errors.password?.message}
      />

      <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
        S&apos;inscrire
      </Button>
    </form>
  );
}
