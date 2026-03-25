import { IEmailJobQueue } from '@/domain/services/IEmailJobQueue';
import { EmailData } from '@/domain/services/IEmailService';

export class MockEmailJobQueue implements IEmailJobQueue {
  private enqueuedEmails: EmailData[] = [];

  async enqueue(data: EmailData): Promise<void> {
    this.enqueuedEmails.push(data);
  }

  getEnqueuedEmails(): EmailData[] {
    return this.enqueuedEmails;
  }

  clear(): void {
    this.enqueuedEmails = [];
  }
}
