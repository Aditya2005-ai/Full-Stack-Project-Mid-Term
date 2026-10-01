import mongoose from 'mongoose';
import { config } from './environment.js';

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] MongoDB Connection Warning: ${error.message}`);
    console.warn('[Database] Running in standalone/offline mode for Phase 01 verification.');
    return null;
  }
};
