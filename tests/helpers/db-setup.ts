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
