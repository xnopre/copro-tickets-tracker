export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  author: string;
  createdAt: Date;
}

export interface CreateCommentData {
  ticketId: string;
  content: string;
  author: string;
}
