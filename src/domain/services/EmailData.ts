import { EmailRecipient } from '@/domain/services/IEmailService';

export interface EmailData {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent: string;
}
