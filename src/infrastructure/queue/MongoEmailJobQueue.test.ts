import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoEmailJobQueue } from './MongoEmailJobQueue';
import { PendingEmailModel } from '@/infrastructure/database/schemas/PendingEmailSchema';
import { EmailData } from '@/domain/services/EmailData';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await PendingEmailModel.deleteMany({});
});

describe('MongoEmailJobQueue', () => {
  const emailData: EmailData = {
    to: [{ email: 'user@example.com', name: 'User' }],
    subject: 'Nouveau ticket',
    htmlContent: '<p>Un ticket a été créé</p>',
    textContent: 'Un ticket a été créé',
  };

  it('should enqueue an email with pending status', async () => {
    const queue = new MongoEmailJobQueue();

    await queue.enqueue(emailData);

    const docs = await PendingEmailModel.find({});
    expect(docs).toHaveLength(1);
    expect(docs[0].status).toBe('pending');
    expect(docs[0].subject).toBe('Nouveau ticket');
    expect(docs[0].attempts).toBe(0);
  });

  it('should store all email fields', async () => {
    const queue = new MongoEmailJobQueue();

    await queue.enqueue(emailData);

    const doc = await PendingEmailModel.findOne({});
    expect(doc!.to[0].email).toBe('user@example.com');
    expect(doc!.to[0].name).toBe('User');
    expect(doc!.htmlContent).toBe('<p>Un ticket a été créé</p>');
    expect(doc!.textContent).toBe('Un ticket a été créé');
  });

  it('should enqueue multiple emails independently', async () => {
    const queue = new MongoEmailJobQueue();
    const emailData2: EmailData = { ...emailData, subject: 'Commentaire ajouté' };

    await queue.enqueue(emailData);
    await queue.enqueue(emailData2);

    const docs = await PendingEmailModel.find({});
    expect(docs).toHaveLength(2);
  });
});
