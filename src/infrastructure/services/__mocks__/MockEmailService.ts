import { IEmailService, EmailData } from '@/domain/services/IEmailService';

/**
 * Mock du service Email pour les tests
 * Permet d'éviter les dépendances aux variables d'environnement
 */
export class MockEmailService implements IEmailService {
  private sentEmails: EmailData[] = [];

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
