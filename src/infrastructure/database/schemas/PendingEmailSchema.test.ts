import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PendingEmailModel } from './PendingEmailSchema';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await PendingEmailModel.deleteMany({});
});

const validEmailData = {
  to: [{ email: 'test@example.com', name: 'Test User' }],
  subject: 'Test Subject',
  htmlContent: '<p>Hello</p>',
  textContent: 'Hello',
};

describe('PendingEmailSchema', () => {
  it('should create a pending email with default status', async () => {
    const doc = await PendingEmailModel.create(validEmailData);

    expect(doc.status).toBe('pending');
    expect(doc.attempts).toBe(0);
    expect(doc.error).toBeUndefined();
  });

  it('should require subject', async () => {
    const { subject: _subject, ...withoutSubject } = validEmailData;
    await expect(PendingEmailModel.create(withoutSubject)).rejects.toThrow();
  });

  it('should require htmlContent', async () => {
    const { htmlContent: _html, ...withoutHtml } = validEmailData;
    await expect(PendingEmailModel.create(withoutHtml)).rejects.toThrow();
  });

  it('should require textContent', async () => {
    const { textContent: _text, ...withoutText } = validEmailData;
    await expect(PendingEmailModel.create(withoutText)).rejects.toThrow();
  });

  it('should accept all valid statuses', async () => {
    for (const status of ['pending', 'processing', 'sent', 'failed'] as const) {
      const doc = await PendingEmailModel.create({ ...validEmailData, status });
      expect(doc.status).toBe(status);
    }
  });

  it('should reject invalid status', async () => {
    await expect(
      PendingEmailModel.create({ ...validEmailData, status: 'invalid' })
    ).rejects.toThrow();
  });

  it('should store error message', async () => {
    const doc = await PendingEmailModel.create({
      ...validEmailData,
      status: 'failed',
      error: 'SMTP connection refused',
    });

    expect(doc.error).toBe('SMTP connection refused');
  });

  it('should set timestamps automatically', async () => {
    const doc = await PendingEmailModel.create(validEmailData);

    expect(doc.createdAt).toBeInstanceOf(Date);
    expect(doc.updatedAt).toBeInstanceOf(Date);
  });
});
