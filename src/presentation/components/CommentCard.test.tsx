import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CommentCard from './CommentCard';
import { Comment } from '@/domain/entities/Comment';
import { mockComment1 } from '@tests/helpers/mockComments';

describe('CommentCard', () => {
  it('should render comment author full name, comment and date', () => {
    const { container } = render(<CommentCard comment={mockComment1} />);
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('Premier commentaire')).toBeInTheDocument();
    const timeElement = container.querySelector('time');
    expect(timeElement).toBeInTheDocument();
    const dateTimeAttr = timeElement?.getAttribute('dateTime');
    expect(dateTimeAttr).toBeTruthy();
    expect(dateTimeAttr).toContain('2025-01-15');
  });

  it('should preserve whitespace in content', () => {
    const commentWithNewlines: Comment = {
      ...mockComment1,
      content: 'Ligne 1\nLigne 2\nLigne 3',
    };
    const { container } = render(<CommentCard comment={commentWithNewlines} />);
    const contentElement = container.querySelector('.whitespace-pre-wrap');
    expect(contentElement).toBeInTheDocument();
  });

  describe('Accessibility', () => {
    it('should use Card component with bordered variant', () => {
      render(<CommentCard comment={mockComment1} />);
      const card = screen.getByTestId('comment-card');
      expect(card).toBeInTheDocument();
    });

    it('should use header element for comment header', () => {
      const { container } = render(<CommentCard comment={mockComment1} />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should have time element with proper dateTime attribute', () => {
      const { container } = render(<CommentCard comment={mockComment1} />);
      const timeElement = container.querySelector('time');
      expect(timeElement).toHaveAttribute('dateTime');
    });
  });
});
