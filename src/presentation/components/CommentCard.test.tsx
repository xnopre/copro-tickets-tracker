import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CommentCard from './CommentCard';
import { Comment } from '@/domain/entities/Comment';

describe('CommentCard', () => {
  const mockComment: Comment = {
    id: '1',
    ticketId: 'ticket-1',
    content: 'Ceci est un commentaire de test',
    author: {
      id: 'user-1',
      firstName: 'Jean',
      lastName: 'Martin',
    },
    createdAt: new Date('2025-01-15T10:30:00'),
  };

  it('should render comment author full name', () => {
    render(<CommentCard comment={mockComment} />);
    expect(screen.getByText('Jean Martin')).toBeInTheDocument();
  });

  it('should render comment content', () => {
    render(<CommentCard comment={mockComment} />);
    expect(screen.getByText('Ceci est un commentaire de test')).toBeInTheDocument();
  });

  it('should render comment date with time element', () => {
    const { container } = render(<CommentCard comment={mockComment} />);
    const timeElement = container.querySelector('time');
    expect(timeElement).toBeInTheDocument();
    const dateTimeAttr = timeElement?.getAttribute('dateTime');
    expect(dateTimeAttr).toBeTruthy();
    expect(dateTimeAttr).toContain('2025-01-15');
  });

  it('should preserve whitespace in content', () => {
    const commentWithNewlines: Comment = {
      ...mockComment,
      content: 'Ligne 1\nLigne 2\nLigne 3',
    };
    const { container } = render(<CommentCard comment={commentWithNewlines} />);
    const contentElement = container.querySelector('.whitespace-pre-wrap');
    expect(contentElement).toBeInTheDocument();
  });

  describe('Accessibility', () => {
    it('should use Card component with bordered variant', () => {
      render(<CommentCard comment={mockComment} />);
      const card = screen.getByTestId('comment-card');
      expect(card).toBeInTheDocument();
    });

    it('should use header element for comment header', () => {
      const { container } = render(<CommentCard comment={mockComment} />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should have time element with proper dateTime attribute', () => {
      const { container } = render(<CommentCard comment={mockComment} />);
      const timeElement = container.querySelector('time');
      expect(timeElement).toHaveAttribute('dateTime');
    });
  });
});
