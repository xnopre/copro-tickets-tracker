import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TicketModel } from '@/infrastructure/database/schemas/TicketSchema';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { useTestDB } from '../tests/helpers/useTestDB';

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mockAuth,
}));

describe('Home Page', () => {
  useTestDB();

  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } } as any);
  });

  it('should display the title "CoTiTra"', async () => {
    const Home = (await import('./page')).default;
    const jsx = await Home();
    render(jsx);

    expect(screen.getByText('CoTiTra')).toBeInTheDocument();
    expect(screen.getByText('Copro Tickets Tracker')).toBeInTheDocument();
    expect(screen.getByText('Gestion de tickets pour copropriété')).toBeInTheDocument();
  });

  it('should display tickets from MongoDB', async () => {
    await TicketModel.create({
      title: 'Ticket 1',
      description: 'Description 1',
      status: TicketStatus.NEW,
    });

    await TicketModel.create({
      title: 'Ticket 2',
      description: 'Description 2',
      status: TicketStatus.IN_PROGRESS,
    });

    const Home = (await import('./page')).default;
    const jsx = await Home();
    render(jsx);

    expect(screen.getByText('Ticket 1')).toBeInTheDocument();
    expect(screen.getByText('Ticket 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('should display create ticket button', async () => {
    const Home = (await import('./page')).default;
    const jsx = await Home();
    render(jsx);

    expect(screen.getByText('+ Créer un ticket')).toBeInTheDocument();
  });

  it('should display empty state when no tickets', async () => {
    const Home = (await import('./page')).default;
    const jsx = await Home();
    render(jsx);

    expect(screen.getByText('Aucun ticket à afficher')).toBeInTheDocument();
  });

  it('should display tickets in correct order (newest first)', async () => {
    await TicketModel.create({
      title: 'Old Ticket',
      description: 'Created first',
      status: TicketStatus.NEW,
    });

    await new Promise(resolve => setTimeout(resolve, 10));

    await TicketModel.create({
      title: 'New Ticket',
      description: 'Created second',
      status: TicketStatus.NEW,
    });

    const Home = (await import('./page')).default;
    const jsx = await Home();
    render(jsx);

    const tickets = screen.getAllByRole('heading', { level: 3 });
    expect(tickets[0]).toHaveTextContent('New Ticket');
    expect(tickets[1]).toHaveTextContent('Old Ticket');
  });

  it('should display ticket status badges', async () => {
    await TicketModel.create({
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
    });

    const Home = (await import('./page')).default;
    const jsx = await Home();
    render(jsx);

    expect(screen.getByText('Nouveau')).toBeInTheDocument();
  });
});
