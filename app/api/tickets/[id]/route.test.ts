import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { TicketService } from '@/application/services/TicketService';
import { CreateTicket } from '@/domain/use-cases/CreateTicket';
import { GetTickets } from '@/domain/use-cases/GetTickets';
import { GetTicketById } from '@/domain/use-cases/GetTicketById';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';

vi.mock('@/application/services/ServiceFactory');

describe('GET /api/tickets/[id]', () => {
  const mockTicketService = {
    getAllTickets: vi.fn(),
    getTicketById: vi.fn(),
    createTicket: vi.fn(),
    createTicketUseCase: {} as CreateTicket,
    getTicketsUseCase: {} as GetTickets,
    getTicketByIdUseCase: {} as GetTicketById,
  } as unknown as TicketService;

  beforeEach(() => {
    vi.mocked(ServiceFactory.getTicketService).mockReturnValue(mockTicketService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a ticket when found', async () => {
    const mockTicket = {
      id: '123',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      createdAt: new Date('2025-01-15T10:00:00Z'),
      updatedAt: new Date('2025-01-15T10:00:00Z'),
    };

    vi.mocked(mockTicketService.getTicketById).mockResolvedValue(mockTicket);

    const request = new NextRequest('http://localhost/api/tickets/123');
    const params = Promise.resolve({ id: '123' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ...mockTicket,
      createdAt: mockTicket.createdAt.toISOString(),
      updatedAt: mockTicket.updatedAt.toISOString(),
    });
    expect(mockTicketService.getTicketById).toHaveBeenCalledWith('123');
  });

  it('should return 400 for invalid ObjectId format', async () => {
    vi.mocked(mockTicketService.getTicketById).mockRejectedValue(new InvalidIdError('invalid-id'));

    const request = new NextRequest('http://localhost/api/tickets/invalid-id');
    const params = Promise.resolve({ id: 'invalid-id' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'ID invalide' });
    expect(mockTicketService.getTicketById).toHaveBeenCalledWith('invalid-id');
  });

  it('should return 404 when ticket not found', async () => {
    vi.mocked(mockTicketService.getTicketById).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/tickets/non-existent');
    const params = Promise.resolve({ id: 'non-existent' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Ticket non trouvé' });
    expect(mockTicketService.getTicketById).toHaveBeenCalledWith('non-existent');
  });

  it('should return 500 when an error occurs', async () => {
    vi.mocked(mockTicketService.getTicketById).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/tickets/123');
    const params = Promise.resolve({ id: '123' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erreur lors de la récupération du ticket' });
  });
});
