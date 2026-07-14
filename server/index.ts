import express, { Request, Response, NextFunction } from 'express';
import next from 'next';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import userRoutes from './routes/authentication/userRoutes';
import authRoutes from './routes/authentication/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import roleRoutes from './routes/roleRoutes';
import meRoutes from './routes/authentication/meRoutes';
import adminRoutes from './routes/authentication/adminRoutes';
import customerRoutes from './routes/customer/customerRoutes';
import customerAdminRoutes from './routes/customer/customerAdminRoutes';
import vendorAdminRoutes from './routes/vendor/vendorAdminRoutes';
import eventRoutes from './routes/event/eventRoutes';
import eventAdminRoutes from './routes/event/eventAdminRoutes';
import locationRoutes from './routes/location/locationRoutes';
import zoneRoutes     from './routes/location/zoneRoutes';
import packageRoutes      from './routes/package/packageRoutes';
import packageAdminRoutes from './routes/package/packageAdminRoutes';
import serviceRoutes      from './routes/service/serviceRoutes';
import serviceAdminRoutes from './routes/service/serviceAdminRoutes';
import calculatorRoutes   from './routes/calculator/calculatorRoutes';

// ─── RBAC Routes ────────────────────────────────────────────────────────────
import rbacRoleRoutes           from './routes/rbac/roleRoutes';
import rbacModuleRoutes         from './routes/rbac/moduleRoutes';
import rbacPermissionRoutes     from './routes/rbac/permissionRoutes';
import rbacRolePermissionRoutes from './routes/rbac/rolePermissionRoutes';
import rbacUserRoleRoutes       from './routes/rbac/userRoleRoutes';

const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

// Build allowed origins from env — supports comma-separated list
const getAllowedOrigins = (): string[] => {
  const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
  return origins.split(',').map((o) => o.trim()).filter(Boolean);
};

app.prepare().then(async () => {
  const server = express();

  // ─── Security Middleware ────────────────────────────────────────────────
  server.use(helmet({
    contentSecurityPolicy: dev ? false : undefined, // Disable CSP only in dev
    crossOriginOpenerPolicy: dev ? false : { policy: 'same-origin-allow-popups' },
}));

  server.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = getAllowedOrigins();
      // Allow requests with no origin (e.g. curl, mobile apps) in development
      if (!origin || dev || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed`));
      }
    },
    credentials: true, // Allow cookies (needed for refreshToken cookie)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ─── Logging ────────────────────────────────────────────────────────────
  server.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]', {
    skip: (req) => req.url.startsWith('/_next/') || req.url.includes('favicon.ico'),
  }));

  // ─── Body Parsing ───────────────────────────────────────────────────────
  server.use(express.json());
  server.use(express.urlencoded({ extended: true })); // Needed for form submissions
  server.use(cookieParser());

  // ─── Database Connection ────────────────────────────────────────────────
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to the database successfully!');
  } catch (err) {
    console.error('❌ Error connecting to the database with Prisma:', err);
  }

  // ─── Health Check ───────────────────────────────────────────────────────
  server.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });

  // ─── API Routes ─────────────────────────────────────────────────────────
  server.use('/api/users', userRoutes);
  server.use('/api/auth', authRoutes);
  server.use('/api/upload', uploadRoutes);
  server.use('/api/roles', roleRoutes);
  server.use('/api/me', meRoutes);        // Authenticated user self-service
  server.use('/api/admin', adminRoutes);  // Admin-only management routes
  server.use('/api/customers', customerRoutes); // Customer self-service routes
  server.use('/api/admin/customers', customerAdminRoutes); // Admin customer management
  server.use('/api/admin/vendors', vendorAdminRoutes);     // Admin vendor management
  server.use('/api/events', eventRoutes);                  // Public event catalog
  server.use('/api/admin/events', eventAdminRoutes);       // Admin event management

  // ─── Zone & Location API ──────────────────────────────────────────────────
  server.use('/api/locations', locationRoutes); // Country/Division/District/City/Area
  server.use('/api/zones',     zoneRoutes);     // Zone, pricing, taxes, delivery, analytics, etc.

  // ─── Package API ──────────────────────────────────────────────────────────
  server.use('/api/packages',       packageRoutes);
  server.use('/api/admin/packages', packageAdminRoutes);
  server.use('/api/services',       serviceRoutes);       // Public service catalog
  server.use('/api/admin/services', serviceAdminRoutes);  // Admin service management
  server.use('/api/calculator',      calculatorRoutes);    // Smart Event Calculator

  // ─── RBAC API ─────────────────────────────────────────────────────────────
  server.use('/api/rbac/roles',            rbacRoleRoutes);
  server.use('/api/rbac/modules',          rbacModuleRoutes);
  server.use('/api/rbac/permissions',      rbacPermissionRoutes);
  server.use('/api/rbac/role-permissions', rbacRolePermissionRoutes);
  server.use('/api/rbac/user-roles',       rbacUserRoleRoutes);

  // ─── Static Uploads ─────────────────────────────────────────────────────
  server.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // ─── Global Error Handler ────────────────────────────────────────────────
  // IMPORTANT: Must be registered BEFORE the Next.js catch-all handler.
  // Express error handlers require exactly 4 parameters (err, req, res, next).
  server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[Global Error]', err);

    let statusCode = err.statusCode || 500;
    if (err.message === 'User already exists with this email') statusCode = 409;
    if (err.message === 'Invalid email or password') statusCode = 401;
    if (err.message === 'Unauthorized') statusCode = 401;
    if (err.message?.startsWith('CORS:')) statusCode = 403;

    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      message,
      data: null,
    });
  });

  // ─── Next.js Catch-all ──────────────────────────────────────────────────
  // Must be LAST — handles all non-API routes (pages, static assets, etc.)
  server.use((req: Request, res: Response) => {
    return handle(req, res);
  });

  // ─── Start Server ───────────────────────────────────────────────────────
  // Capture the returned http.Server instance so we can attach the
  // 'upgrade' event handler below (needed for Next.js Fast Refresh/HMR).
  const httpServer = server.listen(port, () => {
    console.log(`🚀 Ready on http://localhost:${port}`);
  });

  // ─── HMR / WebSocket Upgrade Handling ────────────────────────────────────
  // Next.js Fast Refresh (hot reload) works over a WebSocket connection.
  // WebSocket connections start with an HTTP 'upgrade' request, which is a
  // separate event from normal req/res — Express never sees it unless we
  // forward it manually. Without this block, files compile fine on save,
  // but the browser is never told to reload, so the UI appears "stuck".
  httpServer.on('upgrade', async (req, socket, head) => {
    try {
      await app.getUpgradeHandler()(req, socket as any, head);
    } catch (err) {
      console.error('Error handling upgrade request', err);
      socket.destroy();
    }
  });
}).catch((err) => {
  console.error('Error starting server', err);
  process.exit(1);
});