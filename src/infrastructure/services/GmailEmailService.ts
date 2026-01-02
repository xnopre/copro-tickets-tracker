import nodemailer from 'nodemailer';
import { IEmailService, EmailData } from '@/domain/services/IEmailService';
import { EmailServiceError } from '@/domain/errors/EmailServiceError';
import { logger } from './logger';

export class GmailEmailService implements IEmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor() {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const fromEmail = process.env.FROM_EMAIL;

    if (!gmailUser || !gmailAppPassword || !fromEmail) {
      throw new Error(
        "GMAIL_USER, GMAIL_APP_PASSWORD et FROM_EMAIL doivent être configurés dans les variables d'environnement"
      );
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    this.fromEmail = fromEmail;
  }

  async send(data: EmailData): Promise<void> {
    logger.info('Envoi de mail', {
      subject: data.subject,
      recipients: data.to.map(recipient => recipient.email),
    });
    try {
      const result = await this.transporter.sendMail({
        from: this.fromEmail,
        to: data.to.map(recipient => recipient.email),
        subject: data.subject,
        html: data.htmlContent,
        text: data.textContent,
      });

      logger.info('Email envoyé avec succès', { messageId: result.messageId });
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
      logger.error("Erreur d'envoi (non-bloquante)", error, { service: 'EmailService' });
      return false;
    }
  }
}
