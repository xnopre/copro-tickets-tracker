import { MongoTicketRepository } from '@/infrastructure/repositories/MongoTicketRepository';
import { MongoCommentRepository } from '@/infrastructure/repositories/MongoCommentRepository';
import { MongoUserRepository } from '@/infrastructure/repositories/MongoUserRepository';
import { ResendEmailService } from '@/infrastructure/services/ResendEmailService';
import { GmailEmailService } from '@/infrastructure/services/GmailEmailService';
import { MockEmailService } from '@/infrastructure/services/__mocks__/MockEmailService';
import { EmailTemplates } from '@/infrastructure/services/EmailTemplates';
import { logger } from '@/infrastructure/services/logger';
import { IEmailService } from '@/domain/services/IEmailService';
import { IEmailTemplateService } from '@/domain/services/IEmailTemplateService';
import { ILogger } from '@/domain/services/ILogger';
import { TicketService } from './TicketService';
import { CommentService } from './CommentService';
import { UserService } from './UserService';

export class ServiceFactory {
  private static ticketService: TicketService | null = null;
  private static commentService: CommentService | null = null;
  private static userService: UserService | null = null;
  private static emailService: IEmailService | null = null;
  private static emailTemplateService: IEmailTemplateService | null = null;
  private static loggerInstance: ILogger | null = null;

  static getTicketService(): TicketService {
    if (!this.ticketService) {
      this.ticketService = new TicketService(
        new MongoTicketRepository(),
        new MongoUserRepository(),
        this.getEmailService(),
        this.getEmailTemplateService(),
        this.getLogger()
      );
    }
    return this.ticketService;
  }

  static getCommentService(): CommentService {
    if (!this.commentService) {
      this.commentService = new CommentService(
        new MongoCommentRepository(),
        new MongoTicketRepository(),
        new MongoUserRepository(),
        this.getEmailService(),
        this.getEmailTemplateService(),
        this.getLogger()
      );
    }
    return this.commentService;
  }

  static getUserService(): UserService {
    if (!this.userService) {
      this.userService = new UserService(new MongoUserRepository());
    }
    return this.userService;
  }

  static getEmailService(): IEmailService {
    if (!this.emailService) {
      // En mode test, utiliser le mock pour éviter les dépendances aux variables d'environnement
      if (process.env.NODE_ENV === 'test') {
        this.emailService = new MockEmailService();
      } else {
        const emailProvider = process.env.EMAIL_PROVIDER || 'resend';

        if (emailProvider === 'gmail') {
          this.emailService = new GmailEmailService();
        } else if (emailProvider === 'resend') {
          this.emailService = new ResendEmailService();
        } else {
          throw new Error(
            `EMAIL_PROVIDER invalide: ${emailProvider}. Valeurs acceptées: 'gmail', 'resend'`
          );
        }
      }
    }
    return this.emailService;
  }

  static getEmailTemplateService(): IEmailTemplateService {
    if (!this.emailTemplateService) {
      this.emailTemplateService = new EmailTemplates();
    }
    return this.emailTemplateService;
  }

  static getLogger(): ILogger {
    if (!this.loggerInstance) {
      this.loggerInstance = logger;
    }
    return this.loggerInstance;
  }
}
