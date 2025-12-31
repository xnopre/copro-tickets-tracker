import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TicketDetail from './TicketDetail';
import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

vi.mock('./ArchiveTicketButton', () => ({
  default: ({ ticketId: _ticketId }: { ticketId: string }) => (
    <button aria-label="Archiver le ticket">Archiver</button>
  ),
}));

describe('TicketDetail', () => {
  const mockTicket: Ticket = {
    id: '1',
    title: 'Test Ticket',
    description: 'This is a detailed test ticket description',
    status: TicketStatus.NEW,
    assignedTo: null,
    archived: false,
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
      ariaLabel: 'Statut du ticket : Nouveau',
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-800',
    },
    {
      status: TicketStatus.IN_PROGRESS,
      label: 'En cours',
      ariaLabel: 'Statut du ticket : En cours',
      bgClass: 'bg-yellow-100',
      textClass: 'text-yellow-800',
    },
    {
      status: TicketStatus.RESOLVED,
      label: 'Résolu',
      ariaLabel: 'Statut du ticket : Résolu',
      bgClass: 'bg-green-100',
      textClass: 'text-green-800',
    },
    {
      status: TicketStatus.CLOSED,
      label: 'Fermé',
      ariaLabel: 'Statut du ticket : Fermé',
      bgClass: 'bg-gray-100',
      textClass: 'text-gray-800',
    },
  ])(
    'should apply correct color for $status status',
    ({ status, label, ariaLabel, bgClass, textClass }) => {
      const ticket = { ...mockTicket, status };
      render(<TicketDetail ticket={ticket} />);
      const badge = screen.getByLabelText(ariaLabel);
      expect(badge).toHaveTextContent(label);
      expect(badge).toHaveClass(bgClass, textClass);
    }
  );

  describe('Edit button', () => {
    it('should not render edit button when onEditClick is not provided', () => {
      render(<TicketDetail ticket={mockTicket} />);
      const editButton = screen.queryByRole('button', { name: /Modifier/ });
      expect(editButton).not.toBeInTheDocument();
    });

    it('should render edit button when onEditClick is provided', () => {
      const mockOnEditClick = vi.fn();
      render(<TicketDetail ticket={mockTicket} onEditClick={mockOnEditClick} />);
      const editButton = screen.getByRole('button', { name: /Modifier/ });
      expect(editButton).toBeInTheDocument();
    });

    it('should call onEditClick when edit button is clicked', () => {
      const mockOnEditClick = vi.fn();
      render(<TicketDetail ticket={mockTicket} onEditClick={mockOnEditClick} />);
      const editButton = screen.getByRole('button', { name: /Modifier/ });
      fireEvent.click(editButton);
      expect(mockOnEditClick).toHaveBeenCalledTimes(1);
    });

    it('should have proper aria-label on edit button', () => {
      const mockOnEditClick = vi.fn();
      render(<TicketDetail ticket={mockTicket} onEditClick={mockOnEditClick} />);
      const editButton = screen.getByLabelText('Modifier le titre et la description du ticket');
      expect(editButton).toBeInTheDocument();
    });
  });

  describe('Archive functionality', () => {
    it('should show archive button for non-archived tickets', () => {
      const mockOnEditClick = vi.fn();
      render(<TicketDetail ticket={mockTicket} onEditClick={mockOnEditClick} />);
      const archiveButton = screen.getByRole('button', { name: /archiver le ticket/i });
      expect(archiveButton).toBeInTheDocument();
    });

    it('should not show archive button for archived tickets', () => {
      const archivedTicket = { ...mockTicket, archived: true };
      render(<TicketDetail ticket={archivedTicket} />);
      const archiveButton = screen.queryByRole('button', { name: /archiver le ticket/i });
      expect(archiveButton).not.toBeInTheDocument();
    });

    it('should show ARCHIVÉ indicator for archived tickets', () => {
      const archivedTicket = { ...mockTicket, archived: true };
      render(<TicketDetail ticket={archivedTicket} />);
      const indicator = screen.getByLabelText('Ce ticket est archivé');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent('ARCHIVÉ');
    });

    it('should not show ARCHIVÉ indicator for non-archived tickets', () => {
      render(<TicketDetail ticket={mockTicket} />);
      const indicator = screen.queryByLabelText('Ce ticket est archivé');
      expect(indicator).not.toBeInTheDocument();
    });

    it('should not show edit button for archived tickets', () => {
      const archivedTicket = { ...mockTicket, archived: true };
      const mockOnEditClick = vi.fn();
      render(<TicketDetail ticket={archivedTicket} onEditClick={mockOnEditClick} />);
      const editButton = screen.queryByRole('button', { name: /modifier/i });
      expect(editButton).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label on back link', () => {
      render(<TicketDetail ticket={mockTicket} />);
      const backLink = screen.getByLabelText('Retour à la liste des tickets');
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/');
    });

    it('should have proper aria-label on status badge', () => {
      render(<TicketDetail ticket={mockTicket} />);
      const badge = screen.getByLabelText('Statut du ticket : Nouveau');
      expect(badge).toBeInTheDocument();
    });

    it('should use Card component as wrapper', () => {
      const { container } = render(<TicketDetail ticket={mockTicket} />);
      const card = container.querySelector('.rounded-lg.bg-white.p-8.shadow-lg');
      expect(card).toBeInTheDocument();
    });

    it('should use semantic nav element for back link', () => {
      const { container } = render(<TicketDetail ticket={mockTicket} />);
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Navigation de retour');
    });

    it('should use semantic header element', () => {
      const { container } = render(<TicketDetail ticket={mockTicket} />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should use semantic section with aria-labelledby for description', () => {
      const { container } = render(<TicketDetail ticket={mockTicket} />);
      const section = container.querySelector('section[aria-labelledby="description-heading"]');
      expect(section).toBeInTheDocument();
      const heading = container.querySelector('#description-heading');
      expect(heading).toHaveTextContent('Description');
    });

    it('should use semantic footer for dates info', () => {
      const { container } = render(<TicketDetail ticket={mockTicket} />);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('aria-label', 'Informations supplémentaires');
    });
  });
});
