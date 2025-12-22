import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../vitest.setup';
import EditTicketForm from './EditTicketForm';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

const mockOnTicketUpdated = vi.fn();
const mockOnCancel = vi.fn();

// Mock users data
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
  },
];

describe('EditTicketForm', () => {
  const defaultProps = {
    ticketId: '123',
    currentTitle: 'Original Title',
    currentDescription: 'Original Description',
    currentStatus: TicketStatus.NEW,
    currentAssignedTo: { id: '1', firstName: 'John', lastName: 'Doe' },
    onTicketUpdated: mockOnTicketUpdated,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock /api/users endpoint
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json(mockUsers);
      })
    );
  });

  describe('Rendering', () => {
    it('should render form with pre-filled title and description', () => {
      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement;

      expect(titleInput.value).toBe('Original Title');
      expect(descriptionInput.value).toBe('Original Description');
      expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Annuler/ })).toBeInTheDocument();
    });

    it('should render form with pre-filled status and assignedTo', async () => {
      render(<EditTicketForm {...defaultProps} />);

      const statusSelect = screen.getByLabelText(/Statut/) as HTMLSelectElement;

      // Wait for users to load
      await waitFor(() => {
        const assignedToSelect = screen.getByLabelText(/Personne assignée/) as HTMLSelectElement;
        expect(assignedToSelect.value).toBe('1');
      });

      expect(statusSelect.value).toBe(TicketStatus.NEW);
    });
  });

  describe('Validation', () => {
    it('should show error when title is empty', async () => {
      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      fireEvent.change(titleInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le titre est requis')).toBeInTheDocument();
      });

      expect(mockOnTicketUpdated).not.toHaveBeenCalled();
    });

    it('should show error when title is only whitespace', async () => {
      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      fireEvent.change(titleInput, { target: { value: '   ' } });

      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le titre est requis')).toBeInTheDocument();
      });
    });

    it('should show error when title exceeds 200 characters', async () => {
      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      const longTitle = 'A'.repeat(201);
      fireEvent.change(titleInput, { target: { value: longTitle } });

      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Le titre ne doit pas dépasser 200 caractères')
        ).toBeInTheDocument();
      });
    });

    it('should show error when description is empty', async () => {
      render(<EditTicketForm {...defaultProps} />);

      const descriptionInput = screen.getByLabelText(/Description/);
      fireEvent.change(descriptionInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('La description est requise')).toBeInTheDocument();
      });
    });

    it('should show error when description is only whitespace', async () => {
      render(<EditTicketForm {...defaultProps} />);

      const descriptionInput = screen.getByLabelText(/Description/);
      fireEvent.change(descriptionInput, { target: { value: '   ' } });

      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('La description est requise')).toBeInTheDocument();
      });
    });

    it('should show error when description exceeds 5000 characters', async () => {
      render(<EditTicketForm {...defaultProps} />);

      const descriptionInput = screen.getByLabelText(/Description/);
      const longDescription = 'A'.repeat(5001);
      fireEvent.change(descriptionInput, { target: { value: longDescription } });

      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('La description ne doit pas dépasser 5000 caractères')
        ).toBeInTheDocument();
      });
    });

    it('should allow submission with empty assignedTo (sends null)', async () => {
      const mockUpdatedTicket = {
        id: '123',
        title: 'Updated Title',
        description: 'Updated Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        createdAt: new Date('2025-01-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2025-01-15T11:00:00Z').toISOString(),
      };

      let requestBody: any = null;

      server.use(
        http.patch('/api/tickets/123', async ({ request }) => {
          requestBody = await request.json();
          return HttpResponse.json(mockUpdatedTicket);
        })
      );

      render(<EditTicketForm {...defaultProps} />);

      const assignedToInput = screen.getByLabelText(/Personne assignée/);
      fireEvent.change(assignedToInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Ticket mis à jour avec succès !')).toBeInTheDocument();
      });

      expect(requestBody.assignedTo).toBeNull();
      expect(mockOnTicketUpdated).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form submission', () => {
    it('should update ticket successfully and call onTicketUpdated with all fields', async () => {
      const mockUpdatedTicket = {
        id: '123',
        title: 'Updated Title',
        description: 'Updated Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: null,
        createdAt: new Date('2025-01-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2025-01-15T11:00:00Z').toISOString(),
      };

      let requestBody: any = null;

      server.use(
        http.patch('/api/tickets/123', async ({ request }) => {
          requestBody = await request.json();
          return HttpResponse.json(mockUpdatedTicket);
        })
      );

      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const statusSelect = screen.getByLabelText(/Statut/);
      const assignedToSelect = screen.getByLabelText(/Personne assignée/);
      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });

      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
      fireEvent.change(statusSelect, { target: { value: TicketStatus.IN_PROGRESS } });
      fireEvent.change(assignedToSelect, { target: { value: '' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Ticket mis à jour avec succès !')).toBeInTheDocument();
      });

      expect(requestBody).toEqual({
        title: 'Updated Title',
        description: 'Updated Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: null,
      });

      expect(mockOnTicketUpdated).toHaveBeenCalledTimes(1);
      expect(mockOnTicketUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '123',
          title: 'Updated Title',
          description: 'Updated Description',
          status: TicketStatus.IN_PROGRESS,
          assignedTo: null,
        })
      );
    });

    it('should show loading state during submission', async () => {
      server.use(
        http.patch('/api/tickets/123', async () => {
          return HttpResponse.json({
            id: '123',
            title: 'Updated Title',
            description: 'Updated Description',
            status: TicketStatus.NEW,
            assignedTo: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement;
      const statusSelect = screen.getByLabelText(/Statut/) as HTMLSelectElement;
      const assignedToInput = screen.getByLabelText(/Personne assignée/) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: 'Enregistrer' }) as HTMLButtonElement;
      const cancelButton = screen.getByRole('button', { name: /Annuler/ }) as HTMLButtonElement;

      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
      fireEvent.click(submitButton);

      expect(submitButton.disabled).toBe(true);
      expect(cancelButton.disabled).toBe(true);
      expect(titleInput.disabled).toBe(true);
      expect(descriptionInput.disabled).toBe(true);
      expect(statusSelect.disabled).toBe(true);
      expect(assignedToInput.disabled).toBe(true);
      expect(screen.getByText('Enregistrement en cours...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Ticket mis à jour avec succès !')).toBeInTheDocument();
      });
    });

    it('should show error when API returns error', async () => {
      server.use(
        http.patch('/api/tickets/123', async () => {
          return HttpResponse.json({ error: 'API Error' }, { status: 400 });
        })
      );

      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });

      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('API Error')).toBeInTheDocument();
      });

      expect(mockOnTicketUpdated).not.toHaveBeenCalled();
    });

    it('should handle network error', async () => {
      server.use(
        http.patch('/api/tickets/123', async () => {
          return HttpResponse.error();
        })
      );

      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });

      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
      });
    });
  });

  describe('Cancel behavior', () => {
    it('should call onCancel when cancel button is clicked', () => {
      render(<EditTicketForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /Annuler/ });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnTicketUpdated).not.toHaveBeenCalled();
    });

    it('should not submit when cancel button is clicked', async () => {
      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      fireEvent.change(titleInput, { target: { value: 'Changed Title' } });

      const cancelButton = screen.getByRole('button', { name: /Annuler/ });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
      expect(mockOnTicketUpdated).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-required on required fields', () => {
      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const statusSelect = screen.getByLabelText(/Statut/);
      const assignedToInput = screen.getByLabelText(/Personne assignée/);

      expect(titleInput).toHaveAttribute('aria-required', 'true');
      expect(descriptionInput).toHaveAttribute('aria-required', 'true');
      expect(statusSelect).toHaveAttribute('aria-required', 'true');
      expect(assignedToInput).not.toHaveAttribute('aria-required', 'true');
    });

    it('should have role="alert" and aria-live="assertive" on error messages', async () => {
      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      fireEvent.change(titleInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('Le titre est requis');
        expect(alert).toHaveAttribute('aria-live', 'assertive');
      });
    });

    it('should have aria-busy when submitting and role="status" on success', async () => {
      server.use(
        http.patch('/api/tickets/123', async () => {
          return HttpResponse.json({
            id: '123',
            title: 'Updated Title',
            description: 'Updated Description',
            status: TicketStatus.NEW,
            assignedTo: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );

      render(<EditTicketForm {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Titre/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const submitButton = screen.getByRole('button', { name: 'Enregistrer' });

      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
      fireEvent.click(submitButton);

      expect(submitButton).toHaveAttribute('aria-busy', 'true');

      await waitFor(() => {
        const status = screen.getByRole('status');
        expect(status).toBeInTheDocument();
        expect(status).toHaveTextContent('Ticket mis à jour avec succès !');
      });
    });

    it('should have proper aria-label on cancel button', () => {
      render(<EditTicketForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /Annuler la modification/ });
      expect(cancelButton).toBeInTheDocument();
    });
  });
});
