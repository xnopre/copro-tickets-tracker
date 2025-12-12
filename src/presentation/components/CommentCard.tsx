import { Comment } from '@/domain/entities/Comment';
import { formatTicketDateTime } from '../utils/ticketFormatters';

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <header className="flex justify-between items-start mb-2">
        <p className="font-semibold text-gray-900">{comment.author}</p>
        <time dateTime={comment.createdAt.toISOString()} className="text-sm text-gray-500">
          {formatTicketDateTime(comment.createdAt)}
        </time>
      </header>
      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
    </article>
  );
}
