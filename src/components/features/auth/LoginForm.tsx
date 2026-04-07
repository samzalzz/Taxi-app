'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Required for browser to save/send cookies
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || 'Erreur de connexion');
        return;
      }

      // Role-aware redirect
      const role = result.user?.role;
      if (role === 'DRIVER') {
        router.push('/dashboard/chauffeur');
      } else if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setApiError('Une erreur est survenue');
      console.error('Login error:', error);
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
        label="Email"
        type="email"
        placeholder="votre@email.com"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        {...register('password')}
        error={errors.password?.message}
      />

      <div className="text-center">
        <Link
          href="/mot-de-passe-oublie"
          className="text-primary hover:text-primary-light text-sm font-medium transition-smooth"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
        Se connecter
      </Button>
    </form>
  );
}
