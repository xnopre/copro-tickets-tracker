import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../vitest.setup';
import TicketDetailsWithUpdate from './TicketDetailsWithUpdate';
import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

// Mock TicketDetail
vi.mock('./TicketDetail', () => ({
  default: ({ ticket, onEditClick }: { ticket: Ticket; onEditClick?: () => void }) => (
    <div data-testid="ticket-detail">
      <h1>{ticket.title}</h1>
      <p>{ticket.description}</p>
      <span data-testid="ticket-status">{ticket.status}</span>
      <span data-testid="ticket-assigned-to">{ticket.assignedTo}</span>
      {onEditClick && (
        <button onClick={onEditClick} data-testid="edit-button">
          Modifier
        </button>
      )}
    </div>
  ),
}));

// Mock UpdateTicketStatusForm
vi.mock('./UpdateTicketStatusForm', () => ({
  default: ({
    ticketId,
    currentStatus,
    currentAssignedTo,
    onTicketUpdated,
  }: {
    ticketId: string;
    currentStatus: TicketStatus;
    currentAssignedTo: string | null;
    onTicketUpdated: (ticket: Ticket) => void;
  }) => (
    <div data-testid="update-form" data-ticket-id={ticketId}>
      <p>Current Status: {currentStatus}</p>
      <p>Current Assigned: {currentAssignedTo || 'None'}</p>
      <button
        onClick={() =>
          onTicketUpdated({
            id: ticketId,
            title: 'Test Ticket',
            description: 'Test Description',
            status: TicketStatus.IN_PROGRESS,
            assignedTo: 'Updated Person',
            createdAt: new Date('2025-01-10T10:00:00.000Z'),
            updatedAt: new Date('2025-01-15T12:00:00.000Z'),
          })
        }
      >
        Update Ticket
      </button>
    </div>
  ),
}));

// Mock EditTicketForm
vi.mock('./EditTicketForm', () => ({
  default: ({
    ticketId,
    currentTitle,
    currentDescription,
    onTicketUpdated,
    onCancel,
  }: {
    ticketId: string;
    currentTitle: string;
    currentDescription: string;
    onTicketUpdated: (ticket: Ticket) => void;
    onCancel: () => void;
  }) => (
    <div data-testid="edit-form" data-ticket-id={ticketId}>
      <p>Editing Title: {currentTitle}</p>
      <p>Editing Description: {currentDescription}</p>
      <button
        onClick={() =>
          onTicketUpdated({
            id: ticketId,
            title: 'Updated Title',
            description: 'Updated Description',
            status: TicketStatus.NEW,
            assignedTo: null,
            createdAt: new Date('2025-01-10T10:00:00.000Z'),
            updatedAt: new Date('2025-01-15T14:00:00.000Z'),
          })
        }
      >
        Save Changes
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe('TicketDetailsWithUpdate', () => {
  const mockTicket: Ticket = {
    id: '123',
    title: 'Test Ticket',
    description: 'Test Description',
    status: TicketStatus.NEW,
    assignedTo: null,
    createdAt: new Date('2025-01-10T10:00:00.000Z'),
    updatedAt: new Date('2025-01-10T10:00:00.000Z'),
  };

  it('should render TicketDetail and UpdateTicketStatusForm', () => {
    render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

    expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
    expect(screen.getByTestId('update-form')).toBeInTheDocument();
    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
  });

  it('should pass initial ticket data to both components', () => {
    render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

    // Vérifier TicketDetail
    expect(screen.getByTestId('ticket-status')).toHaveTextContent(TicketStatus.NEW);

    // Vérifier UpdateTicketStatusForm
    expect(screen.getByText('Current Status: NEW')).toBeInTheDocument();
    expect(screen.getByText('Current Assigned: None')).toBeInTheDocument();
  });

  it('should update ticket display when onTicketUpdated is called', async () => {
    render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

    // Vérifier l'état initial
    expect(screen.getByTestId('ticket-status')).toHaveTextContent(TicketStatus.NEW);
    expect(screen.getByTestId('ticket-assigned-to')).toHaveTextContent('');

    // Simuler la mise à jour
    const updateButton = screen.getByText('Update Ticket');
    fireEvent.click(updateButton);

    // Vérifier que l'affichage est mis à jour
    await waitFor(() => {
      expect(screen.getByTestId('ticket-status')).toHaveTextContent(TicketStatus.IN_PROGRESS);
      expect(screen.getByTestId('ticket-assigned-to')).toHaveTextContent('Updated Person');
    });
  });

  it('should update form props when ticket is updated', async () => {
    render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

    // Vérifier l'état initial du formulaire
    expect(screen.getByText('Current Status: NEW')).toBeInTheDocument();
    expect(screen.getByText('Current Assigned: None')).toBeInTheDocument();

    // Simuler la mise à jour
    const updateButton = screen.getByText('Update Ticket');
    fireEvent.click(updateButton);

    // Vérifier que les props du formulaire sont mis à jour
    await waitFor(() => {
      expect(screen.getByText('Current Status: IN_PROGRESS')).toBeInTheDocument();
      expect(screen.getByText('Current Assigned: Updated Person')).toBeInTheDocument();
    });
  });

  it('should maintain ticket id across updates', () => {
    render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

    const updateForm = screen.getByTestId('update-form');
    expect(updateForm).toHaveAttribute('data-ticket-id', '123');

    // Simuler la mise à jour
    const updateButton = screen.getByText('Update Ticket');
    fireEvent.click(updateButton);

    // Vérifier que l'ID reste le même
    expect(updateForm).toHaveAttribute('data-ticket-id', '123');
  });

  describe('Edit mode toggle', () => {
    it('should start in view mode showing TicketDetail and UpdateTicketStatusForm', () => {
      render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

      // Vérifier que TicketDetail et UpdateTicketStatusForm sont visibles
      expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
      expect(screen.getByTestId('update-form')).toBeInTheDocument();
      expect(screen.getByTestId('edit-button')).toBeInTheDocument();

      // Vérifier que EditTicketForm n'est pas visible
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
    });

    it('should switch to edit mode when edit button is clicked', () => {
      render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

      // Cliquer sur le bouton Modifier
      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);

      // Vérifier que EditTicketForm est visible
      expect(screen.getByTestId('edit-form')).toBeInTheDocument();
      expect(screen.getByText('Editing Title: Test Ticket')).toBeInTheDocument();
      expect(screen.getByText('Editing Description: Test Description')).toBeInTheDocument();

      // Vérifier que TicketDetail et UpdateTicketStatusForm ne sont plus visibles
      expect(screen.queryByTestId('ticket-detail')).not.toBeInTheDocument();
      expect(screen.queryByTestId('update-form')).not.toBeInTheDocument();
    });

    it('should return to view mode when cancel button is clicked', () => {
      render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

      // Passer en mode edit
      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);
      expect(screen.getByTestId('edit-form')).toBeInTheDocument();

      // Cliquer sur Cancel
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      // Vérifier le retour en mode view
      expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
      expect(screen.getByTestId('update-form')).toBeInTheDocument();
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
    });

    it('should update ticket and return to view mode when save is clicked', async () => {
      render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

      // Vérifier l'état initial
      expect(screen.getByText('Test Ticket')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();

      // Passer en mode edit
      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);

      // Sauvegarder les modifications
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      // Vérifier que le ticket est mis à jour et retour en mode view
      await waitFor(() => {
        expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
        expect(screen.getByText('Updated Title')).toBeInTheDocument();
        expect(screen.getByText('Updated Description')).toBeInTheDocument();
        expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
      });
    });

    it('should pass current ticket data to EditTicketForm', () => {
      const ticketWithData: Ticket = {
        id: '456',
        title: 'Original Title',
        description: 'Original Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: 'John Doe',
        createdAt: new Date('2025-01-10T10:00:00.000Z'),
        updatedAt: new Date('2025-01-10T10:00:00.000Z'),
      };

      render(<TicketDetailsWithUpdate initialTicket={ticketWithData} />);

      // Passer en mode edit
      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);

      // Vérifier que les données actuelles sont passées à EditTicketForm
      expect(screen.getByText('Editing Title: Original Title')).toBeInTheDocument();
      expect(screen.getByText('Editing Description: Original Description')).toBeInTheDocument();
      expect(screen.getByTestId('edit-form')).toHaveAttribute('data-ticket-id', '456');
    });
  });
});
