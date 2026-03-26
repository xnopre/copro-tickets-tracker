import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BullMQEmailJobQueue, EMAIL_QUEUE_NAME } from './BullMQEmailJobQueue';

import { EmailData } from '@/domain/services/EmailData';

const mockAdd = vi.hoisted(() => vi.fn());
const mockQueueConstructor = vi.hoisted(() => vi.fn());

vi.mock('bullmq', () => ({
  Queue: class {
    constructor(...args: unknown[]) {
      mockQueueConstructor(...args);
    }
    add = mockAdd;
  },
}));

describe('BullMQEmailJobQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a Queue with the correct name and connection', () => {
    new BullMQEmailJobQueue('redis://localhost:6379');

    expect(mockQueueConstructor).toHaveBeenCalledWith(EMAIL_QUEUE_NAME, {
      connection: { url: 'redis://localhost:6379' },
    });
  });

  it('should use the correct queue name', () => {
    expect(EMAIL_QUEUE_NAME).toBe('email');
  });

  it('should enqueue email data with retry options', async () => {
    const queue = new BullMQEmailJobQueue('redis://localhost:6379');

    const emailData: EmailData = {
      to: [{ email: 'test@example.com', name: 'Test User' }],
      subject: 'Test Subject',
      htmlContent: '<p>Test</p>',
      textContent: 'Test',
    };

    await queue.enqueue(emailData);

    expect(mockAdd).toHaveBeenCalledWith('send-email', emailData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  });
});
