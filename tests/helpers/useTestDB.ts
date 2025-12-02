import { beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupTestDB, teardownTestDB, clearDatabase } from './db-setup';

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
