import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Session } from './types';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const SESSION_DURATION = process.env.SESSION_DURATION || '7d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(session: Session): string {
  return jwt.sign(session as object, JWT_SECRET, {
    expiresIn: SESSION_DURATION,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): Session | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

export async function setSession(session: Session): Promise<void> {
  const token = generateToken(session);
  const cookieStore = await cookies();
  
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}