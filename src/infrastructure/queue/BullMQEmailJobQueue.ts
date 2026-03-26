import { Queue } from 'bullmq';
import { IEmailJobQueue } from '@/domain/services/IEmailJobQueue';

import { EmailData } from '@/domain/services/EmailData';

export const EMAIL_QUEUE_NAME = 'email';

export class BullMQEmailJobQueue implements IEmailJobQueue {
  private queue: Queue;

  constructor(redisUrl: string) {
    this.queue = new Queue(EMAIL_QUEUE_NAME, {
      connection: { url: redisUrl },
    });
  }

  async enqueue(data: EmailData): Promise<void> {
    await this.queue.add('send-email', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}
