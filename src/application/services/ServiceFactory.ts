import { MongoTicketRepository } from '@/infrastructure/repositories/MongoTicketRepository';
import { MongoCommentRepository } from '@/infrastructure/repositories/MongoCommentRepository';
import { MongoUserRepository } from '@/infrastructure/repositories/MongoUserRepository';
import { BullMQEmailJobQueue } from '@/infrastructure/queue/BullMQEmailJobQueue';
import { MockEmailJobQueue } from '@/infrastructure/queue/__mocks__/MockEmailJobQueue';
import { EmailTemplates } from '@/infrastructure/services/EmailTemplates';
import { AuthService } from '@/infrastructure/services/AuthService';
import { logger } from '@/infrastructure/services/logger';
import { IEmailJobQueue } from '@/domain/services/IEmailJobQueue';
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
      if (process.env.NODE_ENV === 'test') {
        this.emailJobQueue = new MockEmailJobQueue();
      } else {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
          throw new Error('REDIS_URL environment variable is not defined');
        }
        this.emailJobQueue = new BullMQEmailJobQueue(redisUrl);
      }
    }
    return this.emailJobQueue;
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
