import { cookies } from 'next/headers';
import { JWTPayload, verifyToken } from './jwt';

const SESSION_COOKIE_NAME = 'auth-session';
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

export async function getSession(): Promise<JWTPayload | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const payload = verifyToken(token);
  return payload;
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function verifySession(): Promise<JWTPayload | null> {
  const session = await getSession();
  return session;
}
