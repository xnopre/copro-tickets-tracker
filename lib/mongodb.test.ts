import { describe, it, expect, beforeAll, afterAll, beforeEach, vi, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('MongoDB Connection', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  beforeEach(() => {
    delete global.mongoose;
    vi.resetModules();
  });

  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  describe('Environment Validation', () => {
    it('should throw error if MONGODB_URI is not defined', async () => {
      const originalEnv = process.env.MONGODB_URI;
      delete process.env.MONGODB_URI;

      vi.resetModules();
      const connectDB = (await import('./mongodb')).default;

      await expect(connectDB()).rejects.toThrow(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );

      process.env.MONGODB_URI = originalEnv;
    });
  });

  describe('Connection Management', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = mongoServer.getUri();
    });

    it('should not create new connection if promise is in progress', async () => {
      vi.resetModules();
      const connectDB = (await import('./mongodb')).default;

      const promise1 = connectDB();
      const promise2 = connectDB();

      const [conn1, conn2] = await Promise.all([promise1, promise2]);

      expect(conn1).toBeDefined();
      expect(conn1).toBe(conn2);
      expect(mongoose.connection.readyState).toBe(1);
      expect(global.mongoose?.conn).toBe(conn1);
    });
  });
});
