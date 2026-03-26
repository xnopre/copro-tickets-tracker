import { describe, it, expect, beforeEach } from 'vitest';
import { MockEmailJobQueue } from './MockEmailJobQueue';

import { EmailData } from '@/domain/services/EmailData';

describe('MockEmailJobQueue', () => {
  let queue: MockEmailJobQueue;

  const emailData: EmailData = {
    to: [{ email: 'test@example.com', name: 'Test User' }],
    subject: 'Test Subject',
    htmlContent: '<p>Test</p>',
    textContent: 'Test',
  };

  beforeEach(() => {
    queue = new MockEmailJobQueue();
  });

  it('should enqueue email data', async () => {
    await queue.enqueue(emailData);

    expect(queue.getEnqueuedEmails()).toEqual([emailData]);
  });

  it('should accumulate multiple enqueued emails', async () => {
    const emailData2: EmailData = { ...emailData, subject: 'Subject 2' };

    await queue.enqueue(emailData);
    await queue.enqueue(emailData2);

    expect(queue.getEnqueuedEmails()).toHaveLength(2);
  });

  it('should clear all enqueued emails', async () => {
    await queue.enqueue(emailData);
    queue.clear();

    expect(queue.getEnqueuedEmails()).toHaveLength(0);
  });
});
