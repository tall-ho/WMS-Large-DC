import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const key = new TextEncoder().encode(JWT_SECRET);

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  tenantId: string;
}

export async function signToken(payload: UserPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest): Promise<UserPayload | null> {
  const token = req.cookies.get('token')?.value || req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return await verifyToken(token);
}
