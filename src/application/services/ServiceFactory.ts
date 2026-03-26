import { MongoTicketRepository } from '@/infrastructure/repositories/MongoTicketRepository';
import { MongoCommentRepository } from '@/infrastructure/repositories/MongoCommentRepository';
import { MongoUserRepository } from '@/infrastructure/repositories/MongoUserRepository';
import { MongoEmailJobQueue } from '@/infrastructure/queue/MongoEmailJobQueue';
import { MockEmailJobQueue } from '@/infrastructure/queue/__mocks__/MockEmailJobQueue';
import { GmailEmailService } from '@/infrastructure/services/GmailEmailService';
import { ResendEmailService } from '@/infrastructure/services/ResendEmailService';
import { EmailTemplates } from '@/infrastructure/services/EmailTemplates';
import { AuthService } from '@/infrastructure/services/AuthService';
import { logger } from '@/infrastructure/services/logger';
import { IEmailJobQueue } from '@/domain/services/IEmailJobQueue';
import { IEmailService } from '@/domain/services/IEmailService';
import { IEmailTemplateService } from '@/domain/services/IEmailTemplateService';
import { IAuthService } from '@/domain/services/IAuthService';
import { ILogger } from '@/domain/services/ILogger';
import { TicketService } from './TicketService';
import { CommentService } from './CommentService';
import { UserService } from './UserService';

export class ServiceFactory {
  private static ticketService: TicketService | null = null;
  private static commentService: CommentService | null = null;
  private static userService: UserService | null = null;
  private static authService: IAuthService | null = null;
  private static emailJobQueue: IEmailJobQueue | null = null;
  private static emailServiceInstance: IEmailService | null = null;
  private static emailTemplateService: IEmailTemplateService | null = null;
  private static loggerInstance: ILogger | null = null;

  static getTicketService(): TicketService {
    if (!this.ticketService) {
      this.ticketService = new TicketService(
        new MongoTicketRepository(),
        new MongoUserRepository(),
        this.getEmailJobQueue(),
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
        this.getEmailJobQueue(),
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

  static getAuthService(): IAuthService {
    if (!this.authService) {
      this.authService = new AuthService(new MongoUserRepository());
    }
    return this.authService;
  }

  static getEmailJobQueue(): IEmailJobQueue {
    if (!this.emailJobQueue) {
      if (process.env.NODE_ENV === 'test' || process.env.IS_PLAYWRIGHT_TEST) {
        this.emailJobQueue = new MockEmailJobQueue();
      } else {
        this.emailJobQueue = new MongoEmailJobQueue();
      }
    }
    return this.emailJobQueue;
  }

  static getEmailService(): IEmailService {
    if (!this.emailServiceInstance) {
      const logger = this.getLogger();
      if (process.env.EMAIL_PROVIDER === 'resend') {
        this.emailServiceInstance = new ResendEmailService(logger);
      } else {
        this.emailServiceInstance = new GmailEmailService(logger);
      }
    }
    return this.emailServiceInstance;
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
