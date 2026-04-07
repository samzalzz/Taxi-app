import { BookingForm } from '@/components/features/booking/BookingForm';

export const metadata = {
  title: 'Réserver un trajet — Taxi Leblanc',
  description: 'Réservez votre taxi maintenant',
};

export default function ReserverPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">
          Réserver un trajet
        </h1>
        <p className="text-lg text-on-surface-dim">
          Entrez votre destination et choisissez votre véhicule
        </p>
      </div>

      <BookingForm />
    </div>
  );
}
