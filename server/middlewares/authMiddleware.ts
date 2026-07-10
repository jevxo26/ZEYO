import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Strongly typed user payload attached to req.user after token verification
export interface AuthUser {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'ZEYO_access_secret_2026_please_change_in_production';

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1]; // Expected format: "Bearer <token>"
  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. Invalid token format.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

/**
 * Role-based access control middleware.
 * Usage: requireRole('admin') or requireRole('admin', 'manager')
 * Reads the `role` field from the User's string role field via JWT claims if present,
 * otherwise falls back to trusting the decoded payload.
 *
 * NOTE: For full RBAC, extend the JWT payload to include `role` on login.
 * For now this middleware is a guard layer to protect admin routes.
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // If the JWT was issued with a role claim (future enhancement), check it
    const userWithRole = req.user as AuthUser & { role?: string };
    if (userWithRole.role && !allowedRoles.includes(userWithRole.role)) {
      res.status(403).json({ success: false, message: 'Forbidden. Insufficient permissions.' });
      return;
    }

    next();
  };
};
