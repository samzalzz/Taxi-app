import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET environment variable is required. ' +
    'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
  );
}

const SECRET = JWT_SECRET as string;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, {
    expiresIn: JWT_EXPIRY as string,
    algorithm: 'HS256',
  } as any);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET, {
      algorithms: ['HS256'],
    });
    return decoded as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload | null;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}
