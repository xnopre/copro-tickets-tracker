import { Comment, CreateCommentData } from '../entities/Comment';

export interface ICommentRepository {
  findByTicketId(ticketId: string): Promise<Comment[]>;
  create(data: CreateCommentData): Promise<Comment>;
}
