import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TicketList from './TicketList';
import { mockTicketsList } from '@tests/helpers/mockTickets';

describe('TicketList', () => {
  const mockTickets = mockTicketsList;

  it('should render all tickets', () => {
    render(<TicketList tickets={mockTickets} />);
    expect(screen.queryByText('Aucun ticket à afficher')).not.toBeInTheDocument();
    expect(screen.getByText('First Ticket')).toBeInTheDocument();
    expect(screen.getByText('Second Ticket')).toBeInTheDocument();
    expect(screen.getByText('Third Ticket')).toBeInTheDocument();
  });

  it('should render empty state when no tickets', () => {
    render(<TicketList tickets={[]} />);
    expect(screen.getByText('Aucun ticket à afficher')).toBeInTheDocument();
  });

  describe('Accessibility', () => {
    it('should have role="list" with aria-label', () => {
      const { container } = render(<TicketList tickets={mockTickets} />);
      const list = container.querySelector('[role="list"]');
      expect(list).toBeInTheDocument();
      expect(list).toHaveAttribute('aria-label', 'Liste de 3 tickets');
    });

    it('should have proper aria-label for single ticket', () => {
      const { container } = render(<TicketList tickets={[mockTickets[0]]} />);
      const list = container.querySelector('[role="list"]');
      expect(list).toHaveAttribute('aria-label', 'Liste de 1 ticket');
    });

    it('should have role="status" on empty state', () => {
      const { container } = render(<TicketList tickets={[]} />);
      const emptyState = container.querySelector('[role="status"]');
      expect(emptyState).toBeInTheDocument();
    });

    it('should have aria-live="polite" on empty state', () => {
      const { container } = render(<TicketList tickets={[]} />);
      const emptyState = container.querySelector('[aria-live="polite"]');
      expect(emptyState).toBeInTheDocument();
    });
  });
});
