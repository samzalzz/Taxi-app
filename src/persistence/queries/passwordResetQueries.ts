import crypto from 'crypto';
import { prisma } from '@/persistence/client';

export function generateRawToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  // Invalidate any existing unused tokens for this user first
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { tokenHash, userId, expiresAt },
  });

  return rawToken; // Return raw — never stored in DB
}

export async function validateAndConsumeToken(
  rawToken: string
): Promise<{ valid: true; userId: string } | { valid: false; reason: 'not_found' | 'expired' | 'used' }> {
  const tokenHash = hashToken(rawToken);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record) return { valid: false, reason: 'not_found' };
  if (record.usedAt !== null) return { valid: false, reason: 'used' };
  if (record.expiresAt < new Date()) return { valid: false, reason: 'expired' };

  // Mark as used atomically
  await prisma.passwordResetToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });

  return { valid: true, userId: record.userId };
}
