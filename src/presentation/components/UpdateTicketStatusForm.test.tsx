import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../vitest.setup';
import UpdateTicketStatusForm from './UpdateTicketStatusForm';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

const mockRouterRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRouterRefresh,
  }),
}));

describe('UpdateTicketStatusForm', () => {
  const defaultProps = {
    ticketId: '123',
    currentStatus: TicketStatus.NEW,
    currentAssignedTo: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with status selector and assignedTo field', () => {
    render(<UpdateTicketStatusForm {...defaultProps} />);

    expect(screen.getByLabelText(/Statut/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Personne assignée/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mettre à jour' })).toBeInTheDocument();
  });

  it('should pre-fill the form with current values', () => {
    render(
      <UpdateTicketStatusForm
        ticketId="123"
        currentStatus={TicketStatus.IN_PROGRESS}
        currentAssignedTo="Jean Martin"
      />
    );

    const statusSelect = screen.getByLabelText(/Statut/) as HTMLSelectElement;
    const assignedToInput = screen.getByLabelText(/Personne assignée/) as HTMLInputElement;

    expect(statusSelect.value).toBe(TicketStatus.IN_PROGRESS);
    expect(assignedToInput.value).toBe('Jean Martin');
  });

  describe('Validation', () => {
    it('should show error when assignedTo is empty', async () => {
      render(<UpdateTicketStatusForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Mettre à jour' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le nom de la personne assignée est requis')).toBeInTheDocument();
      });
    });

    it('should not submit when assignedTo is only whitespace', async () => {
      render(<UpdateTicketStatusForm {...defaultProps} />);

      const assignedToInput = screen.getByLabelText(/Personne assignée/);
      fireEvent.change(assignedToInput, { target: { value: '   ' } });

      const submitButton = screen.getByRole('button', { name: 'Mettre à jour' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le nom de la personne assignée est requis')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should update ticket successfully', async () => {
      server.use(
        http.patch('/api/tickets/123', () => {
          return HttpResponse.json({
            id: '123',
            title: 'Test Ticket',
            description: 'Test Description',
            status: TicketStatus.IN_PROGRESS,
            assignedTo: 'Jean Martin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      render(<UpdateTicketStatusForm {...defaultProps} />);

      const statusSelect = screen.getByLabelText(/Statut/);
      const assignedToInput = screen.getByLabelText(/Personne assignée/);

      fireEvent.change(statusSelect, { target: { value: TicketStatus.IN_PROGRESS } });
      fireEvent.change(assignedToInput, { target: { value: 'Jean Martin' } });

      const submitButton = screen.getByRole('button', { name: 'Mettre à jour' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Ticket mis à jour avec succès !')).toBeInTheDocument();
      });

      expect(mockRouterRefresh).toHaveBeenCalled();
    });

    it('should show error when API request fails', async () => {
      server.use(
        http.patch('/api/tickets/123', () => {
          return HttpResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        })
      );

      render(<UpdateTicketStatusForm {...defaultProps} />);

      const assignedToInput = screen.getByLabelText(/Personne assignée/);
      fireEvent.change(assignedToInput, { target: { value: 'Jean Martin' } });

      const submitButton = screen.getByRole('button', { name: 'Mettre à jour' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Erreur serveur')).toBeInTheDocument();
      });
    });

    it('should disable form during submission', async () => {
      server.use(
        http.patch('/api/tickets/123', async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json({
            id: '123',
            title: 'Test Ticket',
            description: 'Test Description',
            status: TicketStatus.IN_PROGRESS,
            assignedTo: 'Jean Martin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      render(<UpdateTicketStatusForm {...defaultProps} />);

      const assignedToInput = screen.getByLabelText(/Personne assignée/);
      fireEvent.change(assignedToInput, { target: { value: 'Jean Martin' } });

      const submitButton = screen.getByRole('button', { name: 'Mettre à jour' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Mise à jour en cours...' })).toBeDisabled();
      });
    });

    it('should trim assignedTo before submission', async () => {
      let capturedBody: any;

      server.use(
        http.patch('/api/tickets/123', async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json({
            id: '123',
            title: 'Test Ticket',
            description: 'Test Description',
            status: TicketStatus.IN_PROGRESS,
            assignedTo: 'Jean Martin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      render(<UpdateTicketStatusForm {...defaultProps} />);

      const assignedToInput = screen.getByLabelText(/Personne assignée/);
      fireEvent.change(assignedToInput, { target: { value: '  Jean Martin  ' } });

      const submitButton = screen.getByRole('button', { name: 'Mettre à jour' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(capturedBody.assignedTo).toBe('Jean Martin');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      render(<UpdateTicketStatusForm {...defaultProps} />);

      const form = screen.getByRole('form', { name: 'Formulaire de mise à jour du statut' });
      expect(form).toBeInTheDocument();

      const statusSelect = screen.getByLabelText(/Statut/);
      expect(statusSelect).toHaveAttribute('aria-required', 'true');

      const assignedToInput = screen.getByLabelText(/Personne assignée/);
      expect(assignedToInput).toHaveAttribute('aria-required', 'true');
    });

    it('should have proper ARIA attributes for error state', async () => {
      render(<UpdateTicketStatusForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Mettre à jour' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const assignedToInput = screen.getByLabelText(/Personne assignée/);
        expect(assignedToInput).toHaveAttribute('aria-invalid', 'true');
        expect(assignedToInput).toHaveAttribute('aria-describedby', 'form-error');
      });

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have proper ARIA attributes for success state', async () => {
      server.use(
        http.patch('/api/tickets/123', () => {
          return HttpResponse.json({
            id: '123',
            title: 'Test Ticket',
            description: 'Test Description',
            status: TicketStatus.IN_PROGRESS,
            assignedTo: 'Jean Martin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      render(<UpdateTicketStatusForm {...defaultProps} />);

      const assignedToInput = screen.getByLabelText(/Personne assignée/);
      fireEvent.change(assignedToInput, { target: { value: 'Jean Martin' } });

      const submitButton = screen.getByRole('button', { name: 'Mettre à jour' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const successMessage = screen.getByRole('status');
        expect(successMessage).toHaveAttribute('aria-live', 'polite');
        expect(successMessage).toHaveTextContent('Ticket mis à jour avec succès !');
      });
    });

    it('should have proper aria-busy during submission', async () => {
      server.use(
        http.patch('/api/tickets/123', async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json({
            id: '123',
            title: 'Test Ticket',
            description: 'Test Description',
            status: TicketStatus.IN_PROGRESS,
            assignedTo: 'Jean Martin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      render(<UpdateTicketStatusForm {...defaultProps} />);

      const assignedToInput = screen.getByLabelText(/Personne assignée/);
      fireEvent.change(assignedToInput, { target: { value: 'Jean Martin' } });

      const submitButton = screen.getByRole('button', { name: 'Mettre à jour' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const busyButton = screen.getByRole('button', { name: 'Mise à jour en cours...' });
        expect(busyButton).toHaveAttribute('aria-busy', 'true');
      });
    });
  });
});
