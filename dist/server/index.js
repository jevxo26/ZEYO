"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/authentication/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authentication/authRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const meRoutes_1 = __importDefault(require("./routes/authentication/meRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/authentication/adminRoutes"));
const prisma = new client_1.PrismaClient();
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
        crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
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
        await prisma.$connect();
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
    server.listen(port, () => {
        console.log(`🚀 Ready on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Error starting server', err);
    process.exit(1);
});
