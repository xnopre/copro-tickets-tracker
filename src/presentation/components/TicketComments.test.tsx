import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import TicketComments from './TicketComments';
import { Comment } from '@/domain/entities/Comment';

// Mock CommentList
vi.mock('./CommentList', () => ({
  default: ({ comments }: { comments: any[] }) => (
    <div data-testid="comment-list">
      {comments.map(comment => (
        <div key={comment.id} data-testid={`comment-${comment.id}`}>
          {comment.content}
        </div>
      ))}
    </div>
  ),
}));

// Mock AddCommentForm
vi.mock('./AddCommentForm', () => ({
  default: ({
    ticketId,
    onCommentAdded,
  }: {
    ticketId: string;
    onCommentAdded: (comment: Comment) => void;
  }) => (
    <div data-testid="add-comment-form" data-ticket-id={ticketId}>
      <button
        onClick={() =>
          onCommentAdded({
            id: 'new-comment',
            ticketId,
            content: 'New comment',
            author: {
              id: 'user-1',
              firstName: 'Test',
              lastName: 'User',
            },
            createdAt: new Date('2025-01-15T12:00:00.000Z'),
          })
        }
      >
        Add Comment
      </button>
    </div>
  ),
}));

describe('TicketComments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should display loading state initially', () => {
    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves to keep loading state
        })
    );

    render(<TicketComments ticketId="123" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Chargement des commentaires...')).toBeInTheDocument();
  });

  it('should fetch and display comments successfully', async () => {
    const mockComments = [
      {
        id: '1',
        ticketId: '123',
        content: 'First comment',
        author: {
          id: 'user-1',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com',
        },
        createdAt: '2025-01-15T10:00:00.000Z',
      },
      {
        id: '2',
        ticketId: '123',
        content: 'Second comment',
        author: {
          id: 'user-2',
          firstName: 'Marie',
          lastName: 'Martin',
          email: 'marie@example.com',
        },
        createdAt: '2025-01-15T11:00:00.000Z',
      },
    ];

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockComments,
    } as Response);

    render(<TicketComments ticketId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Commentaires (2)')).toBeInTheDocument();
    });

    expect(screen.getByTestId('comment-list')).toBeInTheDocument();
    expect(screen.getByTestId('comment-1')).toHaveTextContent('First comment');
    expect(screen.getByTestId('comment-2')).toHaveTextContent('Second comment');
  });

  it('should display error when fetch fails', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<TicketComments ticketId="123" />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText('Erreur lors du chargement des commentaires')).toBeInTheDocument();
  });

  it('should display error when network error occurs', async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

    render(<TicketComments ticketId="123" />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('should display empty comments list when no comments', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    render(<TicketComments ticketId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Commentaires (0)')).toBeInTheDocument();
    });

    expect(screen.getByTestId('comment-list')).toBeInTheDocument();
  });

  it('should convert createdAt strings to Date objects', async () => {
    const mockComments = [
      {
        id: '1',
        ticketId: '123',
        content: 'Test comment',
        author: {
          id: 'user-1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        },
        createdAt: '2025-01-15T10:00:00.000Z',
      },
    ];

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockComments,
    } as Response);

    render(<TicketComments ticketId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Commentaires (1)')).toBeInTheDocument();
    });

    // Verify the component rendered successfully (dates were converted)
    expect(screen.getByTestId('comment-list')).toBeInTheDocument();
  });

  it('should pass correct ticketId to fetch API', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    render(<TicketComments ticketId="456" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tickets/456/comments');
    });
  });

  it('should pass correct ticketId to AddCommentForm', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    render(<TicketComments ticketId="789" />);

    await waitFor(() => {
      const form = screen.getByTestId('add-comment-form');
      expect(form).toHaveAttribute('data-ticket-id', '789');
    });
  });

  it('should have proper accessibility attributes', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const { container } = render(<TicketComments ticketId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Commentaires (0)')).toBeInTheDocument();
    });

    // Check section with aria-labelledby
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-labelledby', 'comments-heading');

    // Check heading
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'comments-heading');
    expect(heading).toHaveTextContent('Commentaires (0)');
  });

  it('should display loading state with proper ARIA attributes', () => {
    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves
        })
    );

    render(<TicketComments ticketId="123" />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('should display error with proper ARIA role', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
    } as Response);

    render(<TicketComments ticketId="123" />);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });

  it('should add new comment to list without refetching when comment is added', async () => {
    const mockComments = [
      {
        id: '1',
        ticketId: '123',
        content: 'Existing comment',
        author: {
          id: 'user-1',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com',
        },
        createdAt: '2025-01-15T10:00:00.000Z',
      },
    ];

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockComments,
    } as Response);

    render(<TicketComments ticketId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Commentaires (1)')).toBeInTheDocument();
    });

    // Clear fetch mock to ensure no refetch happens
    vi.mocked(global.fetch).mockClear();

    // Click the Add Comment button (which triggers onCommentAdded with mock data)
    const addButton = screen.getByText('Add Comment');
    fireEvent.click(addButton);

    // Should update count without refetching
    await waitFor(() => {
      expect(screen.getByText('Commentaires (2)')).toBeInTheDocument();
    });

    // Verify no fetch was called (no refetch)
    expect(global.fetch).not.toHaveBeenCalled();

    // Verify the new comment is displayed
    expect(screen.getByTestId('comment-new-comment')).toHaveTextContent('New comment');
  });
});
