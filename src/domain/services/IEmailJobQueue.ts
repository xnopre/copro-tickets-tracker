import { EmailData } from '@/domain/services/EmailData';

export interface IEmailJobQueue {
  enqueue(data: EmailData): Promise<void>;
}
