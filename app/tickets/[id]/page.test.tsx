import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { Ticket } from '@/domain/entities/Ticket';

// Mock ServiceFactory
const mockGetTicketById = vi.fn();
vi.mock('@/application/services/ServiceFactory', () => ({
  ServiceFactory: {
    getTicketService: () => ({
      getTicketById: mockGetTicketById,
      getTickets: vi.fn(),
      createTicket: vi.fn(),
      updateTicket: vi.fn(),
    }),
  },
}));

// Mock next/navigation
const mockNotFound = vi.fn();
const mockRouterRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  notFound: mockNotFound,
  useRouter: () => ({
    refresh: mockRouterRefresh,
  }),
}));

// Mock TicketComments component
vi.mock('@/presentation/components/TicketComments', () => ({
  default: ({ ticketId }: { ticketId: string }) => (
    <div data-testid="ticket-comments" data-ticket-id={ticketId}>
      TicketComments
    </div>
  ),
}));

describe('TicketPage', () => {
  const mockTicket: Ticket = {
    id: '123',
    title: "Réparer l'ascenseur",
    description: "L'ascenseur est en panne depuis hier",
    status: TicketStatus.IN_PROGRESS,
    assignedTo: 'Jean Dupont',
    archived: false,
    createdAt: new Date('2025-01-15T10:30:00'),
    updatedAt: new Date('2025-01-20T14:45:00'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ticket detail when ticket is found', async () => {
    mockGetTicketById.mockResolvedValue(mockTicket);

    const TicketPage = (await import('./page')).default;
    const jsx = await TicketPage({ params: Promise.resolve({ id: '123' }) });
    render(jsx);

    expect(mockGetTicketById).toHaveBeenCalledWith('123');
    expect(mockNotFound).not.toHaveBeenCalled();

    expect(screen.getByText("Réparer l'ascenseur")).toBeInTheDocument();
    expect(screen.getByText("L'ascenseur est en panne depuis hier")).toBeInTheDocument();

    // Status appears in both badge and form, use getByLabelText for the badge
    const statusBadge = screen.getByLabelText('Statut du ticket : En cours');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('En cours');

    expect(screen.getByText(/Assigné à :/)).toBeInTheDocument();
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
  });

  it('should call notFound when ticket does not exist', async () => {
    mockGetTicketById.mockResolvedValue(null);

    const TicketPage = (await import('./page')).default;

    // notFound() throws an error in Next.js, so we need to catch it
    mockNotFound.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
    });

    await expect(async () => {
      await TicketPage({ params: Promise.resolve({ id: 'non-existent-id' }) });
    }).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mockGetTicketById).toHaveBeenCalledWith('non-existent-id');
    expect(mockNotFound).toHaveBeenCalled();
  });

  it('should render ticket with NEW status', async () => {
    const newTicket: Ticket = {
      ...mockTicket,
      id: '456',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: false,
    };

    mockGetTicketById.mockResolvedValue(newTicket);

    const TicketPage = (await import('./page')).default;
    const jsx = await TicketPage({ params: Promise.resolve({ id: '456' }) });
    render(jsx);

    const statusBadge = screen.getByLabelText('Statut du ticket : Nouveau');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Nouveau');

    expect(screen.queryByText(/Assigné à :/)).not.toBeInTheDocument();
  });

  it('should render ticket with RESOLVED status', async () => {
    const resolvedTicket: Ticket = {
      ...mockTicket,
      id: '789',
      status: TicketStatus.RESOLVED,
      assignedTo: 'Marie Martin',
    };

    mockGetTicketById.mockResolvedValue(resolvedTicket);

    const TicketPage = (await import('./page')).default;
    const jsx = await TicketPage({ params: Promise.resolve({ id: '789' }) });
    render(jsx);

    const statusBadge = screen.getByLabelText('Statut du ticket : Résolu');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Résolu');

    expect(screen.getByText(/Assigné à :/)).toBeInTheDocument();
    expect(screen.getByText('Marie Martin')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', async () => {
    mockGetTicketById.mockResolvedValue(mockTicket);

    const TicketPage = (await import('./page')).default;
    const jsx = await TicketPage({ params: Promise.resolve({ id: '123' }) });
    const { container } = render(jsx);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-label', 'Détail du ticket');
  });

  it('should render TicketComments component with correct ticketId', async () => {
    mockGetTicketById.mockResolvedValue(mockTicket);

    const TicketPage = (await import('./page')).default;
    const jsx = await TicketPage({ params: Promise.resolve({ id: '123' }) });
    render(jsx);

    const ticketComments = screen.getByTestId('ticket-comments');
    expect(ticketComments).toBeInTheDocument();
    expect(ticketComments).toHaveAttribute('data-ticket-id', '123');
  });
});
