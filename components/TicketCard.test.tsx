import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TicketCard from './TicketCard';
import { Ticket, TicketStatus } from '@/types/ticket';

describe('TicketCard', () => {
  const mockTicket: Ticket = {
    id: '1',
    title: 'Test Ticket',
    description: 'This is a test ticket description',
    status: TicketStatus.NEW,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-20'),
  };

  it('should render ticket title', () => {
    render(<TicketCard ticket={mockTicket} />);
    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
  });

  it('should render ticket description', () => {
    render(<TicketCard ticket={mockTicket} />);
    expect(screen.getByText('This is a test ticket description')).toBeInTheDocument();
  });

  it('should render status badge with correct label', () => {
    render(<TicketCard ticket={mockTicket} />);
    expect(screen.getByText('Nouveau')).toBeInTheDocument();
  });

  it('should render created date', () => {
    render(<TicketCard ticket={mockTicket} />);
    expect(screen.getByText(/Créé le 15\/01\/2025/)).toBeInTheDocument();
  });

  it('should render updated date', () => {
    render(<TicketCard ticket={mockTicket} />);
    expect(screen.getByText(/Modifié le 20\/01\/2025/)).toBeInTheDocument();
  });

  it('should apply correct color for NEW status', () => {
    render(<TicketCard ticket={mockTicket} />);
    const badge = screen.getByText('Nouveau');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('should apply correct color for IN_PROGRESS status', () => {
    const inProgressTicket = { ...mockTicket, status: TicketStatus.IN_PROGRESS };
    render(<TicketCard ticket={inProgressTicket} />);
    const badge = screen.getByText('En cours');
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('should apply correct color for RESOLVED status', () => {
    const resolvedTicket = { ...mockTicket, status: TicketStatus.RESOLVED };
    render(<TicketCard ticket={resolvedTicket} />);
    const badge = screen.getByText('Résolu');
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('should apply correct color for CLOSED status', () => {
    const closedTicket = { ...mockTicket, status: TicketStatus.CLOSED };
    render(<TicketCard ticket={closedTicket} />);
    const badge = screen.getByText('Fermé');
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });
});
