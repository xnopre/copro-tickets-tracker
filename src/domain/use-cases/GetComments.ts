import { ICommentRepository } from '../repositories/ICommentRepository';
import { Comment } from '../entities/Comment';

export class GetComments {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(ticketId: string): Promise<Comment[]> {
    const comments = await this.commentRepository.findByTicketId(ticketId);
    return comments;
  }
}
