import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../vitest.setup';
import CreateTicketForm from './CreateTicketForm';

const mockRouterPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe('CreateTicketForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with title and description fields', () => {
    render(<CreateTicketForm />);

    expect(screen.getByLabelText(/Titre/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Créer le ticket' })).toBeInTheDocument();
  });

  describe('Validation', () => {
    it('should show error when title is empty', async () => {
      render(<CreateTicketForm />);

      const submitButton = screen.getByRole('button', { name: 'Créer le ticket' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le titre est requis')).toBeInTheDocument();
      });
    });

    it('should show error when description is empty', async () => {
      render(<CreateTicketForm />);

      const titleInput = screen.getByLabelText(/Titre/);
      fireEvent.change(titleInput, { target: { value: 'Test Title' } });

      const submitButton = screen.getByRole('button', { name: 'Créer le ticket' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('La description est requise')).toBeInTheDocument();
      });
    });

    it('should show error when title exceeds 200 characters', async () => {
      server.use(
        http.post('/api/tickets', async () => {
          return HttpResponse.json(
            { error: 'Erreur côté serveur, bla, bla, bla' },
            { status: 400 }
          );
        })
      );

      render(<CreateTicketForm />);

      const titleInput = screen.getByLabelText(/Titre/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const submitButton = screen.getByRole('button', { name: 'Créer le ticket' });

      const longTitle = 'A'.repeat(201);
      fireEvent.change(titleInput, { target: { value: longTitle } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Erreur côté serveur, bla, bla, bla')).toBeInTheDocument();
      });

      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  describe('Form submission', () => {
    it('should create ticket successfully when form is valid', async () => {
      vi.useFakeTimers();

      server.use(
        http.post('/api/tickets', async () => {
          return HttpResponse.json({
            id: '123',
            title: 'Test Title',
            description: 'Test Description',
            status: 'NEW',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      render(<CreateTicketForm />);

      const titleInput = screen.getByLabelText(/Titre/) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', {
        name: 'Créer le ticket',
      }) as HTMLButtonElement;

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      fireEvent.click(submitButton);

      expect(submitButton.disabled).toBe(true);
      expect(titleInput.disabled).toBe(true);
      expect(descriptionInput.disabled).toBe(true);
      expect(screen.getByText('Création en cours...')).toBeInTheDocument();

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(screen.getByText('Ticket créé avec succès !')).toBeInTheDocument();
      expect(mockRouterPush).toHaveBeenCalledWith('/tickets/123');

      vi.useRealTimers();
    });

    it('should show error when API returns error', async () => {
      server.use(
        http.post('/api/tickets', async () => {
          return HttpResponse.json({ error: 'API Error' }, { status: 400 });
        })
      );

      render(<CreateTicketForm />);

      const titleInput = screen.getByLabelText(/Titre/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const submitButton = screen.getByRole('button', { name: 'Créer le ticket' });

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('API Error')).toBeInTheDocument();
      });

      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-required on required fields', () => {
      render(<CreateTicketForm />);
      const titleInput = screen.getByLabelText(/Titre/);
      const descriptionInput = screen.getByLabelText(/Description/);
      expect(titleInput).toHaveAttribute('aria-required', 'true');
      expect(descriptionInput).toHaveAttribute('aria-required', 'true');
    });

    it('should have role="alert" and aria-live="assertive" on error messages', async () => {
      render(<CreateTicketForm />);
      const submitButton = screen.getByRole('button', { name: 'Créer le ticket' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('Le titre est requis');
        expect(alert).toHaveAttribute('aria-live', 'assertive');
      });
    });

    it('should have aria-busy when submitting and role="status" on success', async () => {
      vi.useFakeTimers();

      server.use(
        http.post('/api/tickets', async () => {
          return HttpResponse.json({
            id: '123',
            title: 'Test',
            description: 'Test',
            status: 'NEW',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      render(<CreateTicketForm />);
      const titleInput = screen.getByLabelText(/Titre/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const submitButton = screen.getByRole('button', { name: 'Créer le ticket' });

      fireEvent.change(titleInput, { target: { value: 'Test' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });
      fireEvent.click(submitButton);

      expect(submitButton).toHaveAttribute('aria-busy', 'true');

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent('Ticket créé avec succès !');

      vi.useRealTimers();
    });
  });
});
