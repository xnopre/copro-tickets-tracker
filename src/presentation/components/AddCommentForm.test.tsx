import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../vitest.setup';
import AddCommentForm from './AddCommentForm';

describe('AddCommentForm', () => {
  const mockOnCommentAdded = vi.fn();
  const ticketId = 'ticket-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with author and content fields', () => {
    render(<AddCommentForm ticketId={ticketId} onCommentAdded={mockOnCommentAdded} />);

    expect(screen.getByLabelText(/Votre nom/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Commentaire/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajouter le commentaire' })).toBeInTheDocument();
  });

  describe('Validation', () => {
    it('should show error when content is empty', async () => {
      render(<AddCommentForm ticketId={ticketId} onCommentAdded={mockOnCommentAdded} />);

      const submitButton = screen.getByRole('button', {
        name: 'Ajouter le commentaire',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le contenu du commentaire est requis')).toBeInTheDocument();
      });
    });

    it('should show error when author is empty', async () => {
      render(<AddCommentForm ticketId={ticketId} onCommentAdded={mockOnCommentAdded} />);

      const contentInput = screen.getByLabelText(/Commentaire/);
      fireEvent.change(contentInput, { target: { value: 'Test comment' } });

      const submitButton = screen.getByRole('button', {
        name: 'Ajouter le commentaire',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("L'auteur du commentaire est requis")).toBeInTheDocument();
      });
    });
  });

  describe('Form submission', () => {
    it('should create comment successfully when form is valid', async () => {
      const mockCreatedAt = new Date('2025-01-15T10:30:00.000Z');

      server.use(
        http.post('/api/tickets/:id/comments', async () => {
          return HttpResponse.json({
            id: 'comment-1',
            ticketId: ticketId,
            content: 'Test comment',
            author: 'Jean Martin',
            createdAt: mockCreatedAt.toISOString(),
          });
        })
      );

      render(<AddCommentForm ticketId={ticketId} onCommentAdded={mockOnCommentAdded} />);

      const authorInput = screen.getByLabelText(/Votre nom/);
      const contentInput = screen.getByLabelText(/Commentaire/);
      const submitButton = screen.getByRole('button', {
        name: 'Ajouter le commentaire',
      });

      fireEvent.change(authorInput, { target: { value: 'Jean Martin' } });
      fireEvent.change(contentInput, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Commentaire ajouté avec succès !')).toBeInTheDocument();
      });

      expect(mockOnCommentAdded).toHaveBeenCalledTimes(1);
      expect(mockOnCommentAdded).toHaveBeenCalledWith({
        id: 'comment-1',
        ticketId: ticketId,
        content: 'Test comment',
        author: 'Jean Martin',
        createdAt: mockCreatedAt,
      });
    });

    it('should clear form after successful submission', async () => {
      server.use(
        http.post('/api/tickets/:id/comments', async () => {
          return HttpResponse.json({
            id: 'comment-1',
            ticketId: ticketId,
            content: 'Test comment',
            author: 'Jean Martin',
            createdAt: new Date().toISOString(),
          });
        })
      );

      render(<AddCommentForm ticketId={ticketId} onCommentAdded={mockOnCommentAdded} />);

      const authorInput = screen.getByLabelText(/Votre nom/) as HTMLInputElement;
      const contentInput = screen.getByLabelText(/Commentaire/) as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', {
        name: 'Ajouter le commentaire',
      });

      fireEvent.change(authorInput, { target: { value: 'Jean Martin' } });
      fireEvent.change(contentInput, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Commentaire ajouté avec succès !')).toBeInTheDocument();
      });

      expect(authorInput.value).toBe('');
      expect(contentInput.value).toBe('');
    });

    it('should handle server errors', async () => {
      server.use(
        http.post('/api/tickets/:id/comments', async () => {
          return HttpResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        })
      );

      render(<AddCommentForm ticketId={ticketId} onCommentAdded={mockOnCommentAdded} />);

      const authorInput = screen.getByLabelText(/Votre nom/);
      const contentInput = screen.getByLabelText(/Commentaire/);
      const submitButton = screen.getByRole('button', {
        name: 'Ajouter le commentaire',
      });

      fireEvent.change(authorInput, { target: { value: 'Jean Martin' } });
      fireEvent.change(contentInput, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Erreur serveur')).toBeInTheDocument();
      });

      expect(mockOnCommentAdded).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      const { container } = render(
        <AddCommentForm ticketId={ticketId} onCommentAdded={mockOnCommentAdded} />
      );

      const form = container.querySelector('form');
      expect(form).toHaveAttribute('aria-label', "Formulaire d'ajout de commentaire");

      const authorInput = screen.getByLabelText(/Votre nom/);
      expect(authorInput).toHaveAttribute('aria-required', 'true');

      const contentInput = screen.getByLabelText(/Commentaire/);
      expect(contentInput).toHaveAttribute('aria-required', 'true');
    });

    it('should display error with aria-live', async () => {
      render(<AddCommentForm ticketId={ticketId} onCommentAdded={mockOnCommentAdded} />);

      const submitButton = screen.getByRole('button', {
        name: 'Ajouter le commentaire',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorElement = screen.getByRole('alert');
        expect(errorElement).toHaveAttribute('aria-live', 'assertive');
      });
    });

    it('should display success with aria-live', async () => {
      server.use(
        http.post('/api/tickets/:id/comments', async () => {
          return HttpResponse.json({
            id: 'comment-1',
            ticketId: ticketId,
            content: 'Test comment',
            author: 'Jean Martin',
            createdAt: new Date().toISOString(),
          });
        })
      );

      render(<AddCommentForm ticketId={ticketId} onCommentAdded={mockOnCommentAdded} />);

      const authorInput = screen.getByLabelText(/Votre nom/);
      const contentInput = screen.getByLabelText(/Commentaire/);
      const submitButton = screen.getByRole('button', {
        name: 'Ajouter le commentaire',
      });

      fireEvent.change(authorInput, { target: { value: 'Jean Martin' } });
      fireEvent.change(contentInput, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const successElement = screen.getByRole('status');
        expect(successElement).toHaveAttribute('aria-live', 'polite');
      });
    });
  });
});
