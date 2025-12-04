import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TicketDetail from './TicketDetail';
import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

describe('TicketDetail', () => {
  const mockTicket: Ticket = {
    id: '1',
    title: 'Test Ticket',
    description: 'This is a detailed test ticket description',
    status: TicketStatus.NEW,
    createdAt: new Date('2025-01-15T10:30:00'),
    updatedAt: new Date('2025-01-20T14:45:00'),
  };

  it('should render ticket title and description', () => {
    render(<TicketDetail ticket={mockTicket} />);
    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
    expect(screen.getByText('This is a detailed test ticket description')).toBeInTheDocument();
    expect(screen.getByText(/Créé le :/)).toBeInTheDocument();
    expect(screen.getByText(/15\/01\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/Modifié le :/)).toBeInTheDocument();
    expect(screen.getByText(/20\/01\/2025/)).toBeInTheDocument();
  });

  it('should render back link to list', () => {
    render(<TicketDetail ticket={mockTicket} />);
    const backLink = screen.getByText('← Retour à la liste');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it.each([
    {
      status: TicketStatus.NEW,
      label: 'Nouveau',
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-800',
    },
    {
      status: TicketStatus.IN_PROGRESS,
      label: 'En cours',
      bgClass: 'bg-yellow-100',
      textClass: 'text-yellow-800',
    },
    {
      status: TicketStatus.RESOLVED,
      label: 'Résolu',
      bgClass: 'bg-green-100',
      textClass: 'text-green-800',
    },
    {
      status: TicketStatus.CLOSED,
      label: 'Fermé',
      bgClass: 'bg-gray-100',
      textClass: 'text-gray-800',
    },
  ])('should apply correct color for $status status', ({ status, label, bgClass, textClass }) => {
    const ticket = { ...mockTicket, status };
    render(<TicketDetail ticket={ticket} />);
    const badge = screen.getByText(label);
    expect(badge).toHaveClass(bgClass, textClass);
  });
});
