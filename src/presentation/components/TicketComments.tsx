'use client';

import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/domain/entities/Comment';
import CommentList from './CommentList';
import AddCommentForm from './AddCommentForm';

interface TicketCommentsProps {
  ticketId: string;
}

export default function TicketComments({ ticketId }: TicketCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/comments`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commentaires');
      }
      const data = await response.json();
      setComments(
        data.map((comment: Comment) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commentaires');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentAdded = useCallback((newComment: Comment) => {
    setComments(prevComments => [...prevComments, newComment]);
  }, []);

  if (isLoading) {
    return (
      <div className="py-8 text-center" role="status" aria-live="polite">
        <p className="text-gray-500">Chargement des commentaires...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-700" role="alert">
        {error}
      </div>
    );
  }

  return (
    <section aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="mb-6 text-2xl font-bold text-gray-900">
        Commentaires ({comments.length})
      </h2>

      <div className="space-y-6">
        <CommentList comments={comments} />
        <AddCommentForm ticketId={ticketId} onCommentAdded={handleCommentAdded} />
      </div>
    </section>
  );
}
