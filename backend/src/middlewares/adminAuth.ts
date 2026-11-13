import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

function requiredSecret(name: 'ADMIN_PASSWORD' | 'JWT_SECRET'): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`Set ${name} in the server environment before startup.`);
  return value;
}

export const adminUser = process.env.ADMIN_USERNAME || 'admin';
export const adminPassword = requiredSecret('ADMIN_PASSWORD');
export const signingSecret = requiredSecret('JWT_SECRET');

export const verifyAdmin: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.match(/^Bearer (\S+)$/i)?.[1];
  if (token) {
    try {
      const claims = jwt.verify(token, signingSecret, { algorithms: ['HS256'] });
      if (typeof claims === 'object' && claims.role === 'admin' && claims.username === adminUser) {
        next();
        return;
      }
    } catch {
      // Expired and invalid tokens use the same response.
    }
  }
  res.status(401).json({ success: false, message: 'Authentication required' });
};
