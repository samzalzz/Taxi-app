'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const driverSignupSchema = z.object({
  // Step 1: Personal info
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Le numéro de téléphone n\'est pas valide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),

  // Step 2: License
  licenseNumber: z.string().min(5, 'Le numéro de permis n\'est pas valide'),
  licenseExpiryDate: z.string().refine(
    (date) => new Date(date) > new Date(),
    'Le permis doit être valide'
  ),

  // Step 3: Vehicle
  vehicleType: z.enum(['BERLINE', 'SUV', 'VAN', 'PREMIUM'], {
    error: 'Veuillez sélectionner un type de véhicule',
  }),
  brand: z.string().min(2, 'La marque est requise'),
  model: z.string().min(2, 'Le modèle est requis'),
  year: z.string().refine(
    (val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1990 && year <= currentYear;
    },
    'L\'année doit être entre 1990 et cette année'
  ),
  color: z.string().min(2, 'La couleur est requise'),
  plateNumber: z.string().min(5, 'La plaque d\'immatriculation n\'est pas valide'),
  capacity: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return num >= 1 && num <= 8;
    },
    'La capacité doit être entre 1 et 8 passagers'
  ),
});

type DriverSignupFormData = z.infer<typeof driverSignupSchema>;

export function DriverSignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<DriverSignupFormData>({
    resolver: zodResolver(driverSignupSchema),
  });

  const vehicleType = watch('vehicleType');

  const handleNextStep = async () => {
    // Validate fields for the current step before advancing
    let fieldsToValidate: (keyof DriverSignupFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ['name', 'email', 'phone', 'password'];
    } else if (step === 2) {
      fieldsToValidate = ['licenseNumber', 'licenseExpiryDate'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data: DriverSignupFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Convert string fields to numbers for API
      const yearNum = parseInt(data.year);
      const capacityNum = data.capacity && data.capacity.trim() ? parseInt(data.capacity) : 1;

      if (isNaN(yearNum) || isNaN(capacityNum)) {
        setApiError('Valeurs numériques invalides');
        return;
      }

      // Convert date string to ISO datetime format
      // Input type="date" provides "YYYY-MM-DD", server expects "YYYY-MM-DDTHH:MM:SSZ"
      const licenseExpiryDateTime = new Date(data.licenseExpiryDate).toISOString();

      const payload = {
        ...data,
        licenseExpiryDate: licenseExpiryDateTime,
        year: yearNum,
        capacity: capacityNum,
      };

      const response = await fetch('/api/auth/driver-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include', // Required for browser to save/send cookies
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Driver signup error:', result);
        setApiError(result.error || result.details || JSON.stringify(result) || 'Erreur lors de l\'inscription');
        return;
      }

      // Redirect to driver dashboard
      router.push('/dashboard/chauffeur');
    } catch (error) {
      setApiError('Une erreur est survenue');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: keyof DriverSignupFormData): string | undefined => {
    return errors[fieldName]?.message;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition-colors ${
              s <= step ? 'bg-primary' : 'bg-on-surface/10'
            }`}
          />
        ))}
      </div>

      {/* Error message */}
      {apiError && (
        <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
          {apiError}
        </div>
      )}

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-2xl font-bold text-on-surface mb-4">Informations personnelles</h2>

          <Input
            label="Nom complet"
            placeholder="Jean Dupont"
            {...register('name')}
            error={getFieldError('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="votre@email.com"
            {...register('email')}
            error={getFieldError('email')}
          />

          <Input
            label="Téléphone"
            type="tel"
            placeholder="+33 6 XX XX XX XX"
            autoComplete="tel"
            {...register('phone')}
            error={getFieldError('phone')}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('password')}
            error={getFieldError('password')}
          />
        </div>
      )}

      {/* Step 2: License */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-2xl font-bold text-on-surface mb-4">Informations du permis</h2>

          <Input
            label="Numéro de permis"
            placeholder="DL123456789FR"
            {...register('licenseNumber')}
            error={getFieldError('licenseNumber')}
          />

          <Input
            label="Date d'expiration du permis"
            type="date"
            {...register('licenseExpiryDate')}
            error={getFieldError('licenseExpiryDate')}
          />
        </div>
      )}

      {/* Step 3: Vehicle */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-2xl font-bold text-on-surface mb-4">Informations du véhicule</h2>

          {/* Vehicle type selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">Type de véhicule</label>
            <div className="grid grid-cols-2 gap-2">
              {['BERLINE', 'SUV', 'VAN', 'PREMIUM'].map((type) => (
                <label
                  key={type}
                  className={`relative flex items-center gap-2 p-3 border border-on-surface/10 rounded-lg cursor-pointer transition-all ${
                    vehicleType === type
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-surface-light'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('vehicleType')}
                    value={type}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    vehicleType === type
                      ? 'bg-primary border-primary'
                      : 'border-on-surface/30'
                  }`} />
                  <span className="text-sm font-medium">{type}</span>
                </label>
              ))}
            </div>
            {getFieldError('vehicleType') && (
              <p className="text-sm text-error">{getFieldError('vehicleType')}</p>
            )}
          </div>

          <Input
            label="Marque"
            placeholder="Peugeot"
            {...register('brand')}
            error={getFieldError('brand')}
          />

          <Input
            label="Modèle"
            placeholder="308"
            {...register('model')}
            error={getFieldError('model')}
          />

          <Input
            label="Année"
            type="number"
            placeholder="2022"
            {...register('year')}
            error={getFieldError('year')}
          />

          <Input
            label="Couleur"
            placeholder="Noir"
            {...register('color')}
            error={getFieldError('color')}
          />

          <Input
            label="Plaque d'immatriculation"
            placeholder="AB-123-CD"
            {...register('plateNumber')}
            error={getFieldError('plateNumber')}
          />

          <Input
            label="Capacité (passagers)"
            type="number"
            placeholder="4"
            min="1"
            max="8"
            {...register('capacity')}
            error={getFieldError('capacity')}
          />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-4 border-t border-on-surface/10">
        {step > 1 && (
          <Button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={isLoading}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>
        )}

        {step < 3 && (
          <Button
            type="button"
            onClick={handleNextStep}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {step === 3 && (
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="flex-1"
          >
            Créer mon compte chauffeur
          </Button>
        )}
      </div>

      {/* Step indicator */}
      <p className="text-center text-xs text-on-surface-dim">
        Étape {step} sur 3
      </p>
    </form>
  );
}
