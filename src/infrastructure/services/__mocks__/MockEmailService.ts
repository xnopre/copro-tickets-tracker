import { IEmailService, EmailData } from '@/domain/services/IEmailService';
import { ILogger } from '@/domain/services/ILogger';

/**
 * Mock du service Email pour les tests
 * Permet d'éviter les dépendances aux variables d'environnement
 */
export class MockEmailService implements IEmailService {
  private sentEmails: EmailData[] = [];

  constructor(_logger: ILogger) {
    // Logger is not used in mock, but injected for consistency
  }

  async send(data: EmailData): Promise<void> {
    this.sentEmails.push(data);
  }

  async sendSafe(data: EmailData): Promise<boolean> {
    try {
      await this.send(data);
      return true;
    } catch {
      return false;
    }
  }

  getSentEmails(): EmailData[] {
    return this.sentEmails;
  }

  clearSentEmails(): void {
    this.sentEmails = [];
  }
}
