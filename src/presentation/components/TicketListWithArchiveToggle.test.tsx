import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import TicketListWithArchiveToggle from './TicketListWithArchiveToggle';
import { mockTicketsWithArchived } from '@tests/helpers/mockTickets';

describe('TicketListWithArchiveToggle', () => {
  const mockTickets = mockTicketsWithArchived;

  describe('Initial state', () => {
    it('should display only active tickets by default', () => {
      render(<TicketListWithArchiveToggle tickets={mockTickets} />);

      expect(screen.getByText('Active Ticket 1')).toBeInTheDocument();
      expect(screen.getByText('Active Ticket 2')).toBeInTheDocument();
      expect(screen.queryByText('Archived Ticket 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Archived Ticket 2')).not.toBeInTheDocument();
    });

    it('should show toggle checkbox unchecked by default', () => {
      render(<TicketListWithArchiveToggle tickets={mockTickets} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Afficher les tickets archivés' });
      expect(checkbox).not.toBeChecked();
    });

    it('should display toggle label', () => {
      render(<TicketListWithArchiveToggle tickets={mockTickets} />);

      expect(screen.getByText('Voir les archives')).toBeInTheDocument();
    });
  });

  describe('Toggle functionality', () => {
    it('should display all tickets when toggle is checked', async () => {
      const user = userEvent.setup();
      render(<TicketListWithArchiveToggle tickets={mockTickets} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Afficher les tickets archivés' });
      await user.click(checkbox);

      expect(screen.getByText('Active Ticket 1')).toBeInTheDocument();
      expect(screen.getByText('Active Ticket 2')).toBeInTheDocument();
      expect(screen.getByText('Archived Ticket 1')).toBeInTheDocument();
      expect(screen.getByText('Archived Ticket 2')).toBeInTheDocument();
    });

    it('should display archived tickets at the end when toggle is checked', async () => {
      const user = userEvent.setup();
      render(<TicketListWithArchiveToggle tickets={mockTickets} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Afficher les tickets archivés' });
      await user.click(checkbox);

      const ticketTitles = screen
        .getAllByRole('link')
        .map(link => link.querySelector('h3')?.textContent);

      const activeTicketsCount = ticketTitles.filter(
        title => title === 'Active Ticket 1' || title === 'Active Ticket 2'
      ).length;
      const archivedTicketsCount = ticketTitles.filter(
        title => title === 'Archived Ticket 1' || title === 'Archived Ticket 2'
      ).length;

      expect(activeTicketsCount).toBe(2);
      expect(archivedTicketsCount).toBe(2);

      const activeTicket1Index = ticketTitles.indexOf('Active Ticket 1');
      const activeTicket2Index = ticketTitles.indexOf('Active Ticket 2');
      const archivedTicket1Index = ticketTitles.indexOf('Archived Ticket 1');
      const archivedTicket2Index = ticketTitles.indexOf('Archived Ticket 2');

      expect(activeTicket1Index).toBeLessThan(archivedTicket1Index);
      expect(activeTicket1Index).toBeLessThan(archivedTicket2Index);
      expect(activeTicket2Index).toBeLessThan(archivedTicket1Index);
      expect(activeTicket2Index).toBeLessThan(archivedTicket2Index);
    });

    it('should hide archived tickets when toggle is unchecked after being checked', async () => {
      const user = userEvent.setup();
      render(<TicketListWithArchiveToggle tickets={mockTickets} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Afficher les tickets archivés' });

      await user.click(checkbox);
      expect(screen.getByText('Archived Ticket 1')).toBeInTheDocument();

      await user.click(checkbox);
      expect(screen.queryByText('Archived Ticket 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Archived Ticket 2')).not.toBeInTheDocument();
      expect(screen.getByText('Active Ticket 1')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should display empty state when no tickets at all', () => {
      render(<TicketListWithArchiveToggle tickets={[]} />);

      expect(screen.getByText('Aucun ticket à afficher')).toBeInTheDocument();
    });

    it('should display empty state when only archived tickets and toggle is off', () => {
      const archivedOnly = mockTickets.filter(t => t.archived);
      render(<TicketListWithArchiveToggle tickets={archivedOnly} />);

      expect(screen.getByText('Aucun ticket à afficher')).toBeInTheDocument();
    });

    it('should display archived tickets when only archived tickets and toggle is on', async () => {
      const user = userEvent.setup();
      const archivedOnly = mockTickets.filter(t => t.archived);
      render(<TicketListWithArchiveToggle tickets={archivedOnly} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Afficher les tickets archivés' });
      await user.click(checkbox);

      expect(screen.getByText('Archived Ticket 1')).toBeInTheDocument();
      expect(screen.getByText('Archived Ticket 2')).toBeInTheDocument();
    });

    it('should work correctly when no archived tickets exist', () => {
      const activeOnly = mockTickets.filter(t => !t.archived);
      render(<TicketListWithArchiveToggle tickets={activeOnly} />);

      expect(screen.getByText('Active Ticket 1')).toBeInTheDocument();
      expect(screen.getByText('Active Ticket 2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      render(<TicketListWithArchiveToggle tickets={mockTickets} />);

      const checkbox = screen.getByRole('checkbox', { name: 'Afficher les tickets archivés' });
      expect(checkbox).toHaveAttribute('id', 'show-archived');

      const label = screen.getByText('Voir les archives').closest('label');
      expect(label).toHaveAttribute('for', 'show-archived');
    });

    it('should have proper aria-label on checkbox', () => {
      render(<TicketListWithArchiveToggle tickets={mockTickets} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Afficher les tickets archivés');
    });
  });
});
