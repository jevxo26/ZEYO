"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = void 0;
exports.connectMongoDB = connectMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
let isConnected = false;
async function connectMongoDB() {
    if (isConnected)
        return;
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.warn('⚠️  MONGODB_URI not set — MongoDB skipped');
        return;
    }
    try {
        await mongoose_1.default.connect(uri, { dbName: 'zeyo' });
        isConnected = true;
        console.log('✅ MongoDB connected');
    }
    catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        // Non-fatal — app continues with PostgreSQL only
    }
}
