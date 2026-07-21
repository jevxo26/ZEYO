"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./config/prisma");
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/authentication/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authentication/authRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const meRoutes_1 = __importDefault(require("./routes/authentication/meRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/authentication/adminRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customer/customerRoutes"));
const customerAdminRoutes_1 = __importDefault(require("./routes/customer/customerAdminRoutes"));
const vendorAdminRoutes_1 = __importDefault(require("./routes/vendor/vendorAdminRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/event/eventRoutes"));
const eventAdminRoutes_1 = __importDefault(require("./routes/event/eventAdminRoutes"));
const locationRoutes_1 = __importDefault(require("./routes/location/locationRoutes"));
const zoneRoutes_1 = __importDefault(require("./routes/location/zoneRoutes"));
const packageRoutes_1 = __importDefault(require("./routes/package/packageRoutes"));
const packageAdminRoutes_1 = __importDefault(require("./routes/package/packageAdminRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/service/serviceRoutes"));
const serviceAdminRoutes_1 = __importDefault(require("./routes/service/serviceAdminRoutes"));
const calculatorRoutes_1 = __importDefault(require("./routes/calculator/calculatorRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/booking/bookingRoutes"));
const bookingAdminRoutes_1 = __importDefault(require("./routes/booking/bookingAdminRoutes"));
const assignmentRoutes_1 = __importDefault(require("./routes/vendor/assignmentRoutes"));
const vendorWorkRoutes_1 = __importDefault(require("./routes/vendor/vendorWorkRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/payment/paymentRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/review/reviewRoutes"));
// ─── Notification & Communication Routes ────────────────────────────────────
const notificationRoutes_1 = __importDefault(require("./routes/notification/notificationRoutes"));
const communicationRoutes_1 = __importDefault(require("./routes/notification/communicationRoutes"));
const adminNotificationRoutes_1 = __importDefault(require("./routes/notification/adminNotificationRoutes"));
// ─── Admin CMS & Config Routes (Part 15) ──────────────────────────────────
const cmsRoutes_1 = __importDefault(require("./routes/admin/cmsRoutes"));
const configRoutes_1 = __importDefault(require("./routes/admin/configRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/admin/dashboardRoutes"));
// ─── Analytics & Reporting Routes (Part 16) ───────────────────────────────
const analyticsRoutes_1 = __importDefault(require("./routes/analytics/analyticsRoutes"));
// ─── RBAC Routes ────────────────────────────────────────────────────────────
const roleRoutes_2 = __importDefault(require("./routes/rbac/roleRoutes"));
const moduleRoutes_1 = __importDefault(require("./routes/rbac/moduleRoutes"));
const permissionRoutes_1 = __importDefault(require("./routes/rbac/permissionRoutes"));
const rolePermissionRoutes_1 = __importDefault(require("./routes/rbac/rolePermissionRoutes"));
const userRoleRoutes_1 = __importDefault(require("./routes/rbac/userRoleRoutes"));
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
// Build allowed origins from env — supports comma-separated list
const getAllowedOrigins = () => {
    const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
    return origins.split(',').map((o) => o.trim()).filter(Boolean);
};
app.prepare().then(async () => {
    const server = (0, express_1.default)();
    // ─── Security Middleware ────────────────────────────────────────────────
    server.use((0, helmet_1.default)({
        contentSecurityPolicy: dev ? false : undefined, // Disable CSP only in dev
        crossOriginOpenerPolicy: dev ? false : { policy: 'same-origin-allow-popups' },
    }));
    server.use((0, cors_1.default)({
        origin: (origin, callback) => {
            const allowedOrigins = getAllowedOrigins();
            // Allow requests with no origin (e.g. curl, mobile apps) in development
            if (!origin || dev || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error(`CORS: Origin '${origin}' is not allowed`));
            }
        },
        credentials: true, // Allow cookies (needed for refreshToken cookie)
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    // ─── Logging ────────────────────────────────────────────────────────────
    server.use((0, morgan_1.default)('[:date[iso]] :method :url :status :response-time ms - :res[content-length]', {
        skip: (req) => req.url.startsWith('/_next/') || req.url.includes('favicon.ico'),
    }));
    // ─── Body Parsing ───────────────────────────────────────────────────────
    server.use(express_1.default.json());
    server.use(express_1.default.urlencoded({ extended: true })); // Needed for form submissions
    server.use((0, cookie_parser_1.default)());
    // ─── Database Connection ────────────────────────────────────────────────
    try {
        await prisma_1.prisma.$connect();
        console.log('✅ Prisma connected to the database successfully!');
    }
    catch (err) {
        console.error('❌ Error connecting to the database with Prisma:', err);
    }
    // ─── Health Check ───────────────────────────────────────────────────────
    server.get('/api/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date() });
    });
    // ─── API Routes ─────────────────────────────────────────────────────────
    server.use('/api/users', userRoutes_1.default);
    server.use('/api/auth', authRoutes_1.default);
    server.use('/api/upload', uploadRoutes_1.default);
    server.use('/api/roles', roleRoutes_1.default);
    server.use('/api/me', meRoutes_1.default); // Authenticated user self-service
    server.use('/api/admin', adminRoutes_1.default); // Admin-only management routes
    server.use('/api/customers', customerRoutes_1.default); // Customer self-service routes
    server.use('/api/admin/customers', customerAdminRoutes_1.default); // Admin customer management
    server.use('/api/admin/vendors', vendorAdminRoutes_1.default); // Admin vendor management
    server.use('/api/events', eventRoutes_1.default); // Public event catalog
    server.use('/api/admin/events', eventAdminRoutes_1.default); // Admin event management
    // ─── Zone & Location API ──────────────────────────────────────────────────
    server.use('/api/locations', locationRoutes_1.default); // Country/Division/District/City/Area
    server.use('/api/zones', zoneRoutes_1.default); // Zone, pricing, taxes, delivery, analytics, etc.
    // ─── Package API ──────────────────────────────────────────────────────────
    server.use('/api/packages', packageRoutes_1.default);
    server.use('/api/admin/packages', packageAdminRoutes_1.default);
    server.use('/api/services', serviceRoutes_1.default); // Public service catalog
    server.use('/api/admin/services', serviceAdminRoutes_1.default); // Admin service management
    server.use('/api/calculator', calculatorRoutes_1.default); // Smart Event Calculator
    server.use('/api/bookings', bookingRoutes_1.default); // Customer bookings
    server.use('/api/admin/bookings', bookingAdminRoutes_1.default); // Admin booking management
    server.use('/api/admin/assignments', assignmentRoutes_1.default); // Vendor Assignment (admin)
    server.use('/api/vendor/work', vendorWorkRoutes_1.default); // Vendor work operations
    server.use('/api/admin/payments', paymentRoutes_1.default); // Payment & Billing (admin)
    server.use('/api/reviews', reviewRoutes_1.default); // Review, Rating & Feedback
    // ─── Notification & Communication API ─────────────────────────────────────
    server.use('/api/notifications', notificationRoutes_1.default);
    server.use('/api/communications', communicationRoutes_1.default);
    server.use('/api/admin/notifications', adminNotificationRoutes_1.default);
    // ─── Admin CMS, Config & Dashboard API ────────────────────────────────────
    server.use('/api/admin/cms', cmsRoutes_1.default);
    server.use('/api/admin/config', configRoutes_1.default);
    server.use('/api/admin/dashboards', dashboardRoutes_1.default);
    // ─── Analytics & Reporting API ────────────────────────────────────────────
    server.use('/api/admin/analytics', analyticsRoutes_1.default);
    // ─── RBAC API ─────────────────────────────────────────────────────────────
    server.use('/api/rbac/roles', roleRoutes_2.default);
    server.use('/api/rbac/modules', moduleRoutes_1.default);
    server.use('/api/rbac/permissions', permissionRoutes_1.default);
    server.use('/api/rbac/role-permissions', rolePermissionRoutes_1.default);
    server.use('/api/rbac/user-roles', userRoleRoutes_1.default);
    // ─── Static Uploads ─────────────────────────────────────────────────────
    server.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'public', 'uploads')));
    // ─── Global Error Handler ────────────────────────────────────────────────
    // IMPORTANT: Must be registered BEFORE the Next.js catch-all handler.
    // Express error handlers require exactly 4 parameters (err, req, res, next).
    server.use((err, req, res, next) => {
        var _a;
        console.error('[Global Error]', err);
        let statusCode = err.statusCode || 500;
        if (err.message === 'User already exists with this email')
            statusCode = 409;
        if (err.message === 'Invalid email or password')
            statusCode = 401;
        if (err.message === 'Unauthorized')
            statusCode = 401;
        if ((_a = err.message) === null || _a === void 0 ? void 0 : _a.startsWith('CORS:'))
            statusCode = 403;
        const message = err.message || 'Internal Server Error';
        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    });
    // ─── Next.js Catch-all ──────────────────────────────────────────────────
    // Must be LAST — handles all non-API routes (pages, static assets, etc.)
    server.use((req, res) => {
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
            await app.getUpgradeHandler()(req, socket, head);
        }
        catch (err) {
            console.error('Error handling upgrade request', err);
            socket.destroy();
        }
    });
}).catch((err) => {
    console.error('Error starting server', err);
    process.exit(1);
});
