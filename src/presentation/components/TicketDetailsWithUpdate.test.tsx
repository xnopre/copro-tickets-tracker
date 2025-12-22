import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TicketDetailsWithUpdate from './TicketDetailsWithUpdate';
import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { UserPublic } from '@/domain/entities/User';

const mockUser: UserPublic = {
  id: '507f1f77bcf86cd799439017',
  firstName: 'John',
  lastName: 'Doe',
};

// Mock TicketDetail
vi.mock('./TicketDetail', () => ({
  default: ({ ticket, onEditClick }: { ticket: Ticket; onEditClick?: () => void }) => (
    <div data-testid="ticket-detail">
      <h1>{ticket.title}</h1>
      <p>{ticket.description}</p>
      <span data-testid="ticket-status">{ticket.status}</span>
      <span data-testid="ticket-assigned-to">
        {ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : ''}
      </span>
      {onEditClick && (
        <button onClick={onEditClick} data-testid="edit-button">
          Modifier
        </button>
      )}
    </div>
  ),
}));

// Mock EditTicketForm
vi.mock('./EditTicketForm', () => ({
  default: ({
    ticketId,
    currentTitle,
    currentDescription,
    currentStatus,
    currentAssignedTo,
    onTicketUpdated,
    onCancel,
  }: {
    ticketId: string;
    currentTitle: string;
    currentDescription: string;
    currentStatus: TicketStatus;
    currentAssignedTo: UserPublic | null;
    onTicketUpdated: (ticket: Ticket) => void;
    onCancel: () => void;
  }) => (
    <div data-testid="edit-form" data-ticket-id={ticketId}>
      <p>Editing Title: {currentTitle}</p>
      <p>Editing Description: {currentDescription}</p>
      <p>Editing Status: {currentStatus}</p>
      <p>Editing Assigned To: {currentAssignedTo?.id || 'None'}</p>
      <button
        onClick={() =>
          onTicketUpdated({
            id: ticketId,
            title: 'Updated Title',
            description: 'Updated Description',
            status: TicketStatus.IN_PROGRESS,
            assignedTo: mockUser,
            archived: false,
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
    archived: false,
    createdAt: new Date('2025-01-10T10:00:00.000Z'),
    updatedAt: new Date('2025-01-10T10:00:00.000Z'),
  };

  it('should render TicketDetail in view mode', () => {
    render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

    expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
  });

  it('should pass initial ticket data to TicketDetail', () => {
    render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

    expect(screen.getByTestId('ticket-status')).toHaveTextContent(TicketStatus.NEW);
    expect(screen.getByTestId('ticket-assigned-to')).toHaveTextContent('');
  });

  describe('Edit mode toggle', () => {
    it('should start in view mode showing TicketDetail', () => {
      render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

      expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
      expect(screen.getByTestId('edit-button')).toBeInTheDocument();
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
    });

    it('should switch to edit mode when edit button is clicked', () => {
      render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);

      expect(screen.getByTestId('edit-form')).toBeInTheDocument();
      expect(screen.getByText('Editing Title: Test Ticket')).toBeInTheDocument();
      expect(screen.getByText('Editing Description: Test Description')).toBeInTheDocument();
      expect(screen.getByText('Editing Status: NEW')).toBeInTheDocument();
      expect(screen.getByText('Editing Assigned To: None')).toBeInTheDocument();
      expect(screen.queryByTestId('ticket-detail')).not.toBeInTheDocument();
    });

    it('should return to view mode when cancel button is clicked', () => {
      render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);
      expect(screen.getByTestId('edit-form')).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
      expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
    });

    it('should update ticket and return to view mode when save is clicked', async () => {
      render(<TicketDetailsWithUpdate initialTicket={mockTicket} />);

      expect(screen.getByText('Test Ticket')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();

      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);

      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
        expect(screen.getByText('Updated Title')).toBeInTheDocument();
        expect(screen.getByText('Updated Description')).toBeInTheDocument();
        expect(screen.getByTestId('ticket-status')).toHaveTextContent(TicketStatus.IN_PROGRESS);
        expect(screen.getByTestId('ticket-assigned-to')).toHaveTextContent('John Doe');
        expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
      });
    });

    it('should pass current ticket data including status and assignedTo to EditTicketForm', () => {
      const ticketWithData: Ticket = {
        id: '456',
        title: 'Original Title',
        description: 'Original Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUser,
        archived: false,
        createdAt: new Date('2025-01-10T10:00:00.000Z'),
        updatedAt: new Date('2025-01-10T10:00:00.000Z'),
      };

      render(<TicketDetailsWithUpdate initialTicket={ticketWithData} />);

      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);

      expect(screen.getByText('Editing Title: Original Title')).toBeInTheDocument();
      expect(screen.getByText('Editing Description: Original Description')).toBeInTheDocument();
      expect(screen.getByText('Editing Status: IN_PROGRESS')).toBeInTheDocument();
      expect(screen.getByText('Editing Assigned To: 507f1f77bcf86cd799439017')).toBeInTheDocument();
      expect(screen.getByTestId('edit-form')).toHaveAttribute('data-ticket-id', '456');
    });
  });
});
