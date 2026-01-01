import { MongoTicketRepository } from '@/infrastructure/repositories/MongoTicketRepository';
import { MongoCommentRepository } from '@/infrastructure/repositories/MongoCommentRepository';
import { MongoUserRepository } from '@/infrastructure/repositories/MongoUserRepository';
import { ResendEmailService } from '@/infrastructure/services/ResendEmailService';
import { MockEmailService } from '@/infrastructure/services/__mocks__/MockEmailService';
import { IEmailService } from '@/domain/services/IEmailService';
import { TicketService } from './TicketService';
import { CommentService } from './CommentService';
import { UserService } from './UserService';

export class ServiceFactory {
  private static ticketService: TicketService | null = null;
  private static commentService: CommentService | null = null;
  private static userService: UserService | null = null;
  private static emailService: IEmailService | null = null;

  static getTicketService(): TicketService {
    if (!this.ticketService) {
      this.ticketService = new TicketService(
        new MongoTicketRepository(),
        new MongoUserRepository(),
        this.getEmailService()
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
        this.getEmailService()
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
        this.emailService = new ResendEmailService();
      }
    }
    return this.emailService;
  }
}
