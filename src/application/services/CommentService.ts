import { ICommentRepository } from '@/domain/repositories/ICommentRepository';
import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IEmailService } from '@/domain/services/IEmailService';
import { IEmailTemplateService } from '@/domain/services/IEmailTemplateService';
import { GetComments } from '@/domain/use-cases/GetComments';
import { AddComment } from '@/domain/use-cases/AddComment';
import { CreateCommentData, Comment } from '@/domain/entities/Comment';

export class CommentService {
  private getCommentsUseCase: GetComments;
  private addCommentUseCase: AddComment;

  constructor(
    commentRepository: ICommentRepository,
    ticketRepository: ITicketRepository,
    userRepository: IUserRepository,
    emailService: IEmailService,
    emailTemplateService: IEmailTemplateService
  ) {
    this.getCommentsUseCase = new GetComments(commentRepository);
    this.addCommentUseCase = new AddComment(
      commentRepository,
      ticketRepository,
      userRepository,
      emailService,
      emailTemplateService
    );
  }

  async getCommentsByTicketId(ticketId: string): Promise<Comment[]> {
    return await this.getCommentsUseCase.execute(ticketId);
  }

  async addComment(data: CreateCommentData): Promise<Comment> {
    return await this.addCommentUseCase.execute(data);
  }
}
