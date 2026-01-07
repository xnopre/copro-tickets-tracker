import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { PATCH } from './route';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { TicketService } from '@/application/services/TicketService';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mockAuth,
}));

vi.mock('@/application/services/ServiceFactory');

describe('PATCH /api/tickets/[id]/archive', () => {
  const mockTicketService = {
    getAllTickets: vi.fn(),
    getTicketById: vi.fn(),
    createTicket: vi.fn(),
    updateTicket: vi.fn(),
    archiveTicket: vi.fn(),
  } as unknown as TicketService;

  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } } as any);
    vi.mocked(ServiceFactory.getTicketService).mockReturnValue(mockTicketService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should archive a ticket successfully', async () => {
    const validId = '507f1f77bcf86cd799439016';
    const mockTicket = {
      id: validId,
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: true,
      createdAt: new Date('2025-01-15T10:00:00Z'),
      updatedAt: new Date('2025-01-15T11:00:00Z'),
    };

    vi.mocked(mockTicketService.archiveTicket).mockResolvedValue(mockTicket);

    const request = new NextRequest(`http://localhost/api/tickets/${validId}/archive`, {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: validId });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ...mockTicket,
      createdAt: mockTicket.createdAt.toISOString(),
      updatedAt: mockTicket.updatedAt.toISOString(),
    });
    expect(mockTicketService.archiveTicket).toHaveBeenCalledWith(validId);
  });

  it('should return 404 when ticket not found', async () => {
    const validId = '507f191e810c19729de860ea';
    vi.mocked(mockTicketService.archiveTicket).mockResolvedValue(null);

    const request = new NextRequest(`http://localhost/api/tickets/${validId}/archive`, {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: validId });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Ticket non trouvé' });
    expect(mockTicketService.archiveTicket).toHaveBeenCalledWith(validId);
  });

  it('should return 400 for invalid ObjectId format', async () => {
    const request = new NextRequest('http://localhost/api/tickets/invalid-id/archive', {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: 'invalid-id' });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'ID de ticket invalide' });
    expect(mockTicketService.archiveTicket).not.toHaveBeenCalled();
  });

  it('should return 500 for server errors', async () => {
    const validId = '507f1f77bcf86cd799439016';
    vi.mocked(mockTicketService.archiveTicket).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest(`http://localhost/api/tickets/${validId}/archive`, {
      method: 'PATCH',
    });
    const params = Promise.resolve({ id: validId });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Erreur lors de l'archivage du ticket" });
    expect(mockTicketService.archiveTicket).toHaveBeenCalledWith(validId);
  });
});
