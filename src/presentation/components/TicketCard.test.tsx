import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TicketCard from './TicketCard';
import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

describe('TicketCard', () => {
  const mockTicket: Ticket = {
    id: '1',
    title: 'Test Ticket',
    description: 'This is a test ticket description',
    status: TicketStatus.NEW,
    assignedTo: null,
    archived: false,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-20'),
  };

  describe('Rendering', () => {
    it('should render ticket information', () => {
      render(<TicketCard ticket={mockTicket} />);
      expect(screen.getByText('Test Ticket')).toBeInTheDocument();
      expect(screen.getByText('This is a test ticket description')).toBeInTheDocument();
      expect(screen.getByText(/Créé le 15\/01\/2025/)).toBeInTheDocument();
      expect(screen.getByText(/Modifié le 20\/01\/2025/)).toBeInTheDocument();
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
      render(<TicketCard ticket={ticket} />);
      const badge = screen.getByText(label);
      expect(badge).toHaveClass(bgClass, textClass);
    });
  });

  describe('Archived tickets', () => {
    it('should display archived badge when ticket is archived', () => {
      const archivedTicket = { ...mockTicket, archived: true };
      render(<TicketCard ticket={archivedTicket} />);

      const archivedBadge = screen.getByLabelText('Ticket archivé');
      expect(archivedBadge).toBeInTheDocument();
      expect(archivedBadge).toHaveClass('bg-gray-200', 'text-gray-700');
      expect(archivedBadge).toHaveTextContent('Archivé');
    });

    it('should not display archived badge when ticket is not archived', () => {
      render(<TicketCard ticket={mockTicket} />);

      const archivedBadge = screen.queryByLabelText('Ticket archivé');
      expect(archivedBadge).not.toBeInTheDocument();
    });

    it('should apply visual styling for archived tickets', () => {
      const archivedTicket = { ...mockTicket, archived: true };
      const { container } = render(<TicketCard ticket={archivedTicket} />);

      const article = container.querySelector('article');
      expect(article).toHaveClass('opacity-70', 'border-2', 'border-gray-300');
    });

    it('should not apply archived styling for non-archived tickets', () => {
      const { container } = render(<TicketCard ticket={mockTicket} />);

      const article = container.querySelector('article');
      expect(article).not.toHaveClass('opacity-70');
      expect(article).not.toHaveClass('border-2');
      expect(article).not.toHaveClass('border-gray-300');
    });

    it('should include archived status in aria-label', () => {
      const archivedTicket = { ...mockTicket, archived: true };
      render(<TicketCard ticket={archivedTicket} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute(
        'aria-label',
        'Voir le ticket : Test Ticket - Statut : Nouveau - Archivé'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes and semantic elements', () => {
      const { container } = render(<TicketCard ticket={mockTicket} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'Voir le ticket : Test Ticket - Statut : Nouveau');

      const badge = screen.getByLabelText('Statut : Nouveau');
      expect(badge).toBeInTheDocument();

      const timeElements = screen.getAllByText(/Créé le|Modifié le/);
      expect(timeElements.length).toBeGreaterThan(0);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });
  });
});
