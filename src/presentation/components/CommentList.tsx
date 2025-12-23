import { Comment } from '@/domain/entities/Comment';
import CommentCard from './CommentCard';

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center" role="status" aria-live="polite">
        <p className="text-gray-500">Aucun commentaire pour le moment</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      role="list"
      aria-label={`Liste de ${comments.length} commentaire${comments.length > 1 ? 's' : ''}`}
    >
      {comments.map(comment => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
