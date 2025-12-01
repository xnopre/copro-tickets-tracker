import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    global.fetch = vi.fn();
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

    expect(global.fetch).not.toHaveBeenCalled();
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

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should create ticket successfully when form is valid', async () => {
    vi.useFakeTimers();

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '123',
        title: 'Test Title',
        description: 'Test Description',
        status: 'NEW',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

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

    expect(global.fetch).toHaveBeenCalledWith('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Test Title', description: 'Test Description' }),
    });

    expect(mockRouterPush).toHaveBeenCalledWith('/');

    vi.useRealTimers();
  });

  it('should show error when API returns error', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error' }),
    });

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
