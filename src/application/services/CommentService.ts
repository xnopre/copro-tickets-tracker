import { ICommentRepository } from '@/domain/repositories/ICommentRepository';
import { GetComments } from '@/domain/use-cases/GetComments';
import { AddComment } from '@/domain/use-cases/AddComment';
import { CreateCommentData, Comment } from '@/domain/entities/Comment';

export class CommentService {
  private getCommentsUseCase: GetComments;
  private addCommentUseCase: AddComment;

  constructor(commentRepository: ICommentRepository) {
    this.getCommentsUseCase = new GetComments(commentRepository);
    this.addCommentUseCase = new AddComment(commentRepository);
  }

  async getCommentsByTicketId(ticketId: string): Promise<Comment[]> {
    return await this.getCommentsUseCase.execute(ticketId);
  }

  async addComment(data: CreateCommentData): Promise<Comment> {
    return await this.addCommentUseCase.execute(data);
  }
}
