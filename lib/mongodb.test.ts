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

      await expect(async () => {
        vi.resetModules();
        await import('./mongodb');
      }).rejects.toThrow('Please define the MONGODB_URI environment variable inside .env.local');

      process.env.MONGODB_URI = originalEnv;
    });
  });

  describe('Connection Management', () => {
    beforeEach(() => {
      process.env.MONGODB_URI = mongoServer.getUri();
    });

    it('should establish connection on first call', async () => {
      vi.resetModules();
      const connectDB = (await import('./mongodb')).default;

      const connection = await connectDB();

      expect(connection).toBeDefined();
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should reuse cached connection on subsequent calls', async () => {
      vi.resetModules();
      const connectDB = (await import('./mongodb')).default;

      const connection1 = await connectDB();
      const connection2 = await connectDB();

      expect(connection1).toBe(connection2);
      expect(global.mongoose.conn).toBe(connection1);
    });

    it('should use correct connection options', async () => {
      vi.resetModules();
      const connectSpy = vi.spyOn(mongoose, 'connect');
      const connectDB = (await import('./mongodb')).default;

      await connectDB();

      expect(connectSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          bufferCommands: false,
        })
      );
    });

    it('should initialize global cache if absent', async () => {
      expect(global.mongoose).toBeUndefined();

      vi.resetModules();
      const connectDB = (await import('./mongodb')).default;

      await connectDB();

      expect(global.mongoose).toBeDefined();
      expect(global.mongoose.conn).toBeDefined();
      expect(global.mongoose.promise).toBeDefined();
    });

    it('should not create new connection if promise is in progress', async () => {
      vi.resetModules();
      const connectDB = (await import('./mongodb')).default;

      const promise1 = connectDB();
      const promise2 = connectDB();

      const [conn1, conn2] = await Promise.all([promise1, promise2]);

      expect(conn1).toBe(conn2);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection failures gracefully', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

      const connectionError = new Error('Connection failed');
      vi.spyOn(mongoose, 'connect').mockRejectedValueOnce(connectionError);

      vi.resetModules();
      const connectDB = (await import('./mongodb')).default;

      await expect(connectDB()).rejects.toThrow('Connection failed');
      expect(global.mongoose.promise).toBeNull();
    });
  });
});
