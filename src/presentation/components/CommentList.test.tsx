import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CommentList from './CommentList';
import { Comment } from '@/domain/entities/Comment';

describe('CommentList', () => {
  const mockComments: Comment[] = [
    {
      id: '1',
      ticketId: 'ticket-1',
      content: 'Premier commentaire',
      author: {
        id: 'user-1',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean@example.com',
      },
      createdAt: new Date('2025-01-15T10:30:00'),
    },
    {
      id: '2',
      ticketId: 'ticket-1',
      content: 'Deuxième commentaire',
      author: {
        id: 'user-2',
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie@example.com',
      },
      createdAt: new Date('2025-01-15T11:00:00'),
    },
    {
      id: '3',
      ticketId: 'ticket-1',
      content: 'Troisième commentaire',
      author: {
        id: 'user-3',
        firstName: 'Pierre',
        lastName: 'Durand',
        email: 'pierre@example.com',
      },
      createdAt: new Date('2025-01-15T12:00:00'),
    },
  ];

  it('should render all comments', () => {
    render(<CommentList comments={mockComments} />);
    expect(screen.queryByText('Aucun commentaire pour le moment')).not.toBeInTheDocument();
    expect(screen.getByText('Premier commentaire')).toBeInTheDocument();
    expect(screen.getByText('Deuxième commentaire')).toBeInTheDocument();
    expect(screen.getByText('Troisième commentaire')).toBeInTheDocument();
  });

  it('should render empty state when no comments', () => {
    render(<CommentList comments={[]} />);
    expect(screen.getByText('Aucun commentaire pour le moment')).toBeInTheDocument();
  });

  describe('Accessibility', () => {
    it('should have role="list" with aria-label', () => {
      const { container } = render(<CommentList comments={mockComments} />);
      const list = container.querySelector('[role="list"]');
      expect(list).toBeInTheDocument();
      expect(list).toHaveAttribute('aria-label', 'Liste de 3 commentaires');
    });

    it('should have proper aria-label for single comment', () => {
      const { container } = render(<CommentList comments={[mockComments[0]]} />);
      const list = container.querySelector('[role="list"]');
      expect(list).toHaveAttribute('aria-label', 'Liste de 1 commentaire');
    });

    it('should have role="status" on empty state', () => {
      const { container } = render(<CommentList comments={[]} />);
      const emptyState = container.querySelector('[role="status"]');
      expect(emptyState).toBeInTheDocument();
    });

    it('should have aria-live="polite" on empty state', () => {
      const { container } = render(<CommentList comments={[]} />);
      const emptyState = container.querySelector('[aria-live="polite"]');
      expect(emptyState).toBeInTheDocument();
    });
  });
});
