import { EmailData } from './IEmailService';

export interface IEmailJobQueue {
  enqueue(data: EmailData): Promise<void>;
}
