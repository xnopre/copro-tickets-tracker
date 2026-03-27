import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { resetInterruptedEmails, processPendingEmails } from './pendingEmailProcessor';
import { PendingEmailModel } from '@/infrastructure/database/schemas/PendingEmailSchema';
import { IEmailService } from '@/domain/services/IEmailService';

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
  vi.clearAllMocks();
});

const validEmailData = {
  to: [{ email: 'test@example.com', name: 'Test User' }],
  subject: 'Test',
  htmlContent: '<p>Test</p>',
  textContent: 'Test',
};

describe('resetInterruptedEmails', () => {
  it('should reset processing emails to pending', async () => {
    await PendingEmailModel.create({ ...validEmailData, status: 'processing' });
    await PendingEmailModel.create({ ...validEmailData, status: 'processing' });
    await PendingEmailModel.create({ ...validEmailData, status: 'sent' });

    await resetInterruptedEmails();

    const pending = await PendingEmailModel.find({ status: 'pending' });
    const processing = await PendingEmailModel.find({ status: 'processing' });
    expect(pending).toHaveLength(2);
    expect(processing).toHaveLength(0);
  });

  it('should not affect pending, sent or failed emails', async () => {
    await PendingEmailModel.create({ ...validEmailData, status: 'pending' });
    await PendingEmailModel.create({ ...validEmailData, status: 'sent' });
    await PendingEmailModel.create({ ...validEmailData, status: 'failed' });

    await resetInterruptedEmails();

    expect(await PendingEmailModel.countDocuments({ status: 'pending' })).toBe(1);
    expect(await PendingEmailModel.countDocuments({ status: 'sent' })).toBe(1);
    expect(await PendingEmailModel.countDocuments({ status: 'failed' })).toBe(1);
  });
});

describe('processPendingEmails', () => {
  const mockEmailService: IEmailService = {
    send: vi.fn(),
    sendSafe: vi.fn(),
  };

  it('should send pending emails and mark them as sent', async () => {
    await PendingEmailModel.create({ ...validEmailData, status: 'pending' });
    await PendingEmailModel.create({ ...validEmailData, status: 'pending' });
    vi.mocked(mockEmailService.send).mockResolvedValue(undefined);

    const result = await processPendingEmails(mockEmailService);

    expect(result).toEqual({ sent: 2, failed: 0 });
    expect(await PendingEmailModel.countDocuments({ status: 'sent' })).toBe(2);
    expect(await PendingEmailModel.countDocuments({ status: 'pending' })).toBe(0);
  });

  it('should increment attempts after processing', async () => {
    await PendingEmailModel.create({ ...validEmailData, status: 'pending' });
    vi.mocked(mockEmailService.send).mockResolvedValue(undefined);

    await processPendingEmails(mockEmailService);

    const doc = await PendingEmailModel.findOne({});
    expect(doc!.attempts).toBe(1);
  });

  it('should mark email as failed and store error on send failure', async () => {
    await PendingEmailModel.create({ ...validEmailData, status: 'pending' });
    vi.mocked(mockEmailService.send).mockRejectedValue(new Error('SMTP error'));

    const result = await processPendingEmails(mockEmailService);

    expect(result).toEqual({ sent: 0, failed: 1 });
    const doc = await PendingEmailModel.findOne({});
    expect(doc!.status).toBe('failed');
    expect(doc!.error).toBe('SMTP error');
    expect(doc!.attempts).toBe(1);
  });

  it('should process emails one by one (sent then failed)', async () => {
    await PendingEmailModel.create({ ...validEmailData, subject: 'Email 1', status: 'pending' });
    await PendingEmailModel.create({ ...validEmailData, subject: 'Email 2', status: 'pending' });
    vi.mocked(mockEmailService.send)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('fail'));

    const result = await processPendingEmails(mockEmailService);

    expect(result).toEqual({ sent: 1, failed: 1 });
  });

  it('should not process already sent or failed emails', async () => {
    await PendingEmailModel.create({ ...validEmailData, status: 'sent' });
    await PendingEmailModel.create({ ...validEmailData, status: 'failed' });

    const result = await processPendingEmails(mockEmailService);

    expect(result).toEqual({ sent: 0, failed: 0 });
    expect(mockEmailService.send).not.toHaveBeenCalled();
  });
});
