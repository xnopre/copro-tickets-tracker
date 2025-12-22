import { MongoTicketRepository } from '@/infrastructure/repositories/MongoTicketRepository';
import { MongoCommentRepository } from '@/infrastructure/repositories/MongoCommentRepository';
import { MongoUserRepository } from '@/infrastructure/repositories/MongoUserRepository';
import { TicketService } from './TicketService';
import { CommentService } from './CommentService';
import { UserService } from './UserService';

export class ServiceFactory {
  private static ticketService: TicketService | null = null;
  private static commentService: CommentService | null = null;
  private static userService: UserService | null = null;

  static getTicketService(): TicketService {
    if (!this.ticketService) {
      this.ticketService = new TicketService(new MongoTicketRepository());
    }
    return this.ticketService;
  }

  static getCommentService(): CommentService {
    if (!this.commentService) {
      this.commentService = new CommentService(new MongoCommentRepository());
    }
    return this.commentService;
  }

  static getUserService(): UserService {
    if (!this.userService) {
      this.userService = new UserService(new MongoUserRepository());
    }
    return this.userService;
  }
}
