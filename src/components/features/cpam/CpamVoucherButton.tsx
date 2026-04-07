'use client';

import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CpamVoucherButtonProps {
  bookingId: string;
  isCpam: boolean;
  status: string;
  onClick: () => void;
  hasVoucher?: boolean;
}

/**
 * Button to open CPAM voucher modal - only shown for CPAM bookings
 */
export function CpamVoucherButton({
  bookingId: _bookingId,
  isCpam,
  status,
  onClick,
  hasVoucher,
}: CpamVoucherButtonProps) {
  if (!isCpam) return null;

  const isCompleted = status === 'COMPLETED';

  return (
    <Button
      onClick={onClick}
      disabled={!isCompleted}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      title={
        !isCompleted
          ? 'Le bon de transport est disponible après la fin de la course'
          : 'Gérer le bon de transport CPAM'
      }
    >
      <FileText className="w-4 h-4" />
      {hasVoucher ? 'Bon généré' : 'Bon de transport'}
    </Button>
  );
}
