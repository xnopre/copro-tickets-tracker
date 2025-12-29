import { beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export async function setupTestDB(): Promise<MongoMemoryServer> {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri);

  return mongoServer;
}

export async function teardownTestDB(mongoServer: MongoMemoryServer | undefined): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}

export async function clearDatabase(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

/**
 * Custom Vitest hook for MongoDB test setup
 * Usage: Call this function at the beginning of your describe block
 *
 * Example:
 * describe('My Test Suite', () => {
 *   useTestDB();
 *
 *   it('should work', async () => {
 *     // Your test code
 *   });
 * });
 */
export function useTestDB() {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await setupTestDB();
    process.env.MONGODB_URI = mongoServer.getUri();
  });

  afterAll(async () => {
    await teardownTestDB(mongoServer);
  });

  beforeEach(async () => {
    await clearDatabase();
  });
}
