import { Resend } from 'resend';
import { IEmailService, EmailData } from '@/domain/services/IEmailService';
import { EmailServiceError } from '@/domain/errors/EmailServiceError';

export class ResendEmailService implements IEmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      throw new Error(
        "RESEND_API_KEY et FROM_EMAIL doivent être configurés dans les variables d'environnement"
      );
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async send(data: EmailData): Promise<void> {
    console.log(
      `Envoi d'un mail [${data.subject}] à ${data.to.map(recipient => recipient.email).join(', ')}`
    );
    try {
      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: data.to.map(recipient => recipient.email),
        subject: data.subject,
        html: data.htmlContent,
        text: data.textContent,
      });

      if (response.error) {
        throw new EmailServiceError(
          `Échec d'envoi d'email: ${response.error.message || 'Erreur inconnue'}`,
          new Error(response.error.message)
        );
      }

      console.log(`Email envoyé avec succès:`, response.data);
    } catch (error) {
      throw new EmailServiceError(
        `Échec d'envoi d'email: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async sendSafe(data: EmailData): Promise<boolean> {
    try {
      await this.send(data);
      return true;
    } catch (error) {
      console.error("[EmailService] Erreur d'envoi (non-bloquante):", error);
      return false;
    }
  }
}
