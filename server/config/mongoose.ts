import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongoDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — MongoDB skipped');
    return;
  }

  try {
    await mongoose.connect(uri, { dbName: 'zeyo' });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err: any) {
    console.error('❌ MongoDB connection failed:', err.message);
    // Non-fatal — app continues with PostgreSQL only
  }
}

export { mongoose };
