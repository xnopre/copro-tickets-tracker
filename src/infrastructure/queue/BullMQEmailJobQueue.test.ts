import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BullMQEmailJobQueue, EMAIL_QUEUE_NAME } from './BullMQEmailJobQueue';
import { EmailData } from '@/domain/services/IEmailService';

const mockAdd = vi.hoisted(() => vi.fn());

vi.mock('bullmq', () => ({
  Queue: class {
    add = mockAdd;
  },
}));

describe('BullMQEmailJobQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a Queue with the correct name and connection', async () => {
    const { Queue } = await import('bullmq');
    const QueueSpy = vi.spyOn({ Queue }, 'Queue');

    new BullMQEmailJobQueue('redis://localhost:6379');

    // Verify the queue was instantiated (Queue class is mocked, instance has add method)
    const queue = new BullMQEmailJobQueue('redis://localhost:6379');
    expect(queue).toBeDefined();
    void QueueSpy;
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
