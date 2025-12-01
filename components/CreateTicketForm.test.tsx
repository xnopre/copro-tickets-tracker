import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../vitest.setup';
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

    expect(screen.getByLabelText('Titre')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Créer le ticket' })).toBeInTheDocument();
  });

  it('should show error when title is empty', async () => {
    render(<CreateTicketForm />);

    const submitButton = screen.getByRole('button', { name: 'Créer le ticket' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Le titre est requis')).toBeInTheDocument();
    });

    // Pas de requête API si la validation échoue
  });

  it('should show error when description is empty', async () => {
    render(<CreateTicketForm />);

    const titleInput = screen.getByLabelText('Titre');
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    const submitButton = screen.getByRole('button', { name: 'Créer le ticket' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La description est requise')).toBeInTheDocument();
    });

    // Pas de requête API si la validation échoue
  });

  it('should create ticket successfully when form is valid', async () => {
    vi.useFakeTimers();

    // Configurer le handler MSW pour simuler une création de ticket réussie
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

    const titleInput = screen.getByLabelText('Titre') as HTMLInputElement;
    const descriptionInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
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

    // Avancer le temps pour résoudre les promesses et les timers
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByText('Ticket créé avec succès !')).toBeInTheDocument();
    expect(mockRouterPush).toHaveBeenCalledWith('/');

    vi.useRealTimers();
  });

  it('should show error when API returns error', async () => {
    // Configurer le handler MSW pour simuler une erreur API
    server.use(
      http.post('/api/tickets', async () => {
        return HttpResponse.json({ error: 'API Error' }, { status: 400 });
      })
    );

    render(<CreateTicketForm />);

    const titleInput = screen.getByLabelText('Titre');
    const descriptionInput = screen.getByLabelText('Description');
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
