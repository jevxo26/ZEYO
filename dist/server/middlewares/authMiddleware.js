"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'ZEYO_access_secret_2026_please_change_in_production';
const verifyToken = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};
exports.verifyToken = verifyToken;
/**
 * Role-based access control middleware.
 * Usage: requireRole('admin') or requireRole('admin', 'manager')
 * Reads the `role` field from the User's string role field via JWT claims if present,
 * otherwise falls back to trusting the decoded payload.
 *
 * NOTE: For full RBAC, extend the JWT payload to include `role` on login.
 * For now this middleware is a guard layer to protect admin routes.
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        // If the JWT was issued with a role claim (future enhancement), check it
        const userWithRole = req.user;
        if (userWithRole.role && !allowedRoles.includes(userWithRole.role)) {
            res.status(403).json({ success: false, message: 'Forbidden. Insufficient permissions.' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
