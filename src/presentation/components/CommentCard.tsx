import { Comment } from '@/domain/entities/Comment';
import { formatTicketDateTime } from '../utils/ticketFormatters';
import Card from '@/presentation/components/ui/Card';

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <article
      data-testid="comment-card"
      aria-label={`Commentaire de ${comment.author} le ${formatTicketDateTime(comment.createdAt)}`}
    >
      <Card variant="bordered" shadow="sm" padding="sm">
        <header className="mb-2 flex items-start justify-between">
          <p className="font-semibold text-gray-900">{comment.author}</p>
          <time dateTime={comment.createdAt.toISOString()} className="text-sm text-gray-500">
            {formatTicketDateTime(comment.createdAt)}
          </time>
        </header>
        <p className="whitespace-pre-wrap text-gray-700">{comment.content}</p>
      </Card>
    </article>
  );
}
