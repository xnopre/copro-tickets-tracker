import { User } from './User';

export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  author: User;
  createdAt: Date;
}

export interface CreateCommentData {
  ticketId: string;
  content: string;
  authorId: string;
}
