import { Comment } from '@/domain/entities/Comment';
import { formatTicketDateTime } from '../utils/ticketFormatters';

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <header className="mb-2 flex items-start justify-between">
        <p className="font-semibold text-gray-900">{comment.author}</p>
        <time dateTime={comment.createdAt.toISOString()} className="text-sm text-gray-500">
          {formatTicketDateTime(comment.createdAt)}
        </time>
      </header>
      <p className="whitespace-pre-wrap text-gray-700">{comment.content}</p>
    </article>
  );
}
