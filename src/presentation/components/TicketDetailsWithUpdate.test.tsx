import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../../vitest.setup';
import TicketDetailsWithUpdate from './TicketDetailsWithUpdate';
import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

// Mock TicketDetail
vi.mock('./TicketDetail', () => ({
  default: ({ ticket }: { ticket: Ticket }) => (
    <div data-testid="ticket-detail">
      <h1>{ticket.title}</h1>
      <p>{ticket.description}</p>
      <span data-testid="ticket-status">{ticket.status}</span>
      <span data-testid="ticket-assigned-to">{ticket.assignedTo}</span>
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
});
