import { UserPublic } from './User';

export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  author: UserPublic;
  createdAt: Date;
}

export interface CreateCommentData {
  ticketId: string;
  content: string;
  authorId: string;
}
