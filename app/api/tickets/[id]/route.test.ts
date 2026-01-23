import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH } from './route';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { TicketService } from '@/application/services/TicketService';
import { CreateTicket } from '@/domain/use-cases/CreateTicket';
import { GetTickets } from '@/domain/use-cases/GetTickets';
import { GetTicketById } from '@/domain/use-cases/GetTicketById';
import { ValidationError } from '@/domain/errors/ValidationError';
import { mockUserPublic1, mockUserPublic2 } from '@tests/helpers/mockUsers';

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mockAuth,
}));

vi.mock('@/application/services/ServiceFactory');

describe('GET /api/tickets/[id]', () => {
  const mockTicketService = {
    getAllTickets: vi.fn(),
    getTicketById: vi.fn(),
    createTicket: vi.fn(),
    updateTicket: vi.fn(),
    createTicketUseCase: {} as CreateTicket,
    getTicketsUseCase: {} as GetTickets,
    getTicketByIdUseCase: {} as GetTicketById,
  } as unknown as TicketService;

  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } } as any);
    vi.mocked(ServiceFactory.getTicketService).mockReturnValue(mockTicketService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a ticket when found', async () => {
    const validId = '507f1f77bcf86cd799439016';
    const mockTicket = {
      id: validId,
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      createdBy: mockUserPublic1,
      assignedTo: null,
      archived: false,
      createdAt: new Date('2025-01-15T10:00:00Z'),
      updatedAt: new Date('2025-01-15T10:00:00Z'),
    };

    vi.mocked(mockTicketService.getTicketById).mockResolvedValue(mockTicket);

    const request = new NextRequest(`http://localhost/api/tickets/${validId}`);
    const params = Promise.resolve({ id: validId });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ...mockTicket,
      createdAt: mockTicket.createdAt.toISOString(),
      updatedAt: mockTicket.updatedAt.toISOString(),
    });
    expect(mockTicketService.getTicketById).toHaveBeenCalledWith(validId);
  });

  it('should return 400 for invalid ObjectId format', async () => {
    const request = new NextRequest('http://localhost/api/tickets/invalid-id');
    const params = Promise.resolve({ id: 'invalid-id' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'ID de ticket invalide' });
  });

  it('should return 404 when ticket not found', async () => {
    const validId = '507f191e810c19729de860ea';
    vi.mocked(mockTicketService.getTicketById).mockResolvedValue(null);

    const request = new NextRequest(`http://localhost/api/tickets/${validId}`);
    const params = Promise.resolve({ id: validId });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Ticket non trouvé' });
    expect(mockTicketService.getTicketById).toHaveBeenCalledWith(validId);
  });

  it('should return 500 when an error occurs', async () => {
    const validId = '507f1f77bcf86cd799439016';
    vi.mocked(mockTicketService.getTicketById).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest(`http://localhost/api/tickets/${validId}`);
    const params = Promise.resolve({ id: validId });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erreur lors de la récupération du ticket' });
  });
});

describe('PATCH /api/tickets/[id]', () => {
  const mockTicketService = {
    getAllTickets: vi.fn(),
    getTicketById: vi.fn(),
    createTicket: vi.fn(),
    updateTicket: vi.fn(),
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

  describe('Update status and assignedTo', () => {
    it('should update status and assignedTo successfully', async () => {
      const validId = '507f1f77bcf86cd799439016';
      const assignedUserId = '507f1f77bcf86cd799439017';
      const mockUpdatedTicket = {
        id: validId,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        createdBy: mockUserPublic1,
        assignedTo: mockUserPublic1,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T11:00:00Z'),
      };

      vi.mocked(mockTicketService.updateTicket).mockResolvedValue(mockUpdatedTicket);

      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: TicketStatus.IN_PROGRESS,
          assignedTo: assignedUserId,
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockUpdatedTicket,
        createdAt: mockUpdatedTicket.createdAt.toISOString(),
        updatedAt: mockUpdatedTicket.updatedAt.toISOString(),
      });
      expect(mockTicketService.updateTicket).toHaveBeenCalledWith(validId, {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: assignedUserId,
        title: undefined,
        description: undefined,
      });
    });

    it('should return 400 when status is invalid', async () => {
      const validId = '507f1f77bcf86cd799439016';
      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'INVALID_STATUS',
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('status');
      expect(data.details[0].message).toBe('Le statut est invalide');
    });

    it('should return 400 when assignedTo is invalid ObjectId format', async () => {
      const validId = '507f1f77bcf86cd799439016';
      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          assignedTo: 'invalid-id',
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('assignedTo');
      expect(data.details[0].message).toBe('ID doit être un ObjectId MongoDB valide');
    });
  });

  describe('Update title and description', () => {
    it('should update title and description successfully and trim whitespace', async () => {
      const validId = '507f1f77bcf86cd799439016';
      const mockUpdatedTicket = {
        id: validId,
        title: 'Updated Title',
        description: 'Updated Description',
        status: TicketStatus.NEW,
        createdBy: mockUserPublic1,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T11:30:00Z'),
      };

      vi.mocked(mockTicketService.updateTicket).mockResolvedValue(mockUpdatedTicket);

      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: '  Updated Title  ',
          description: '  Updated Description  ',
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockUpdatedTicket,
        createdAt: mockUpdatedTicket.createdAt.toISOString(),
        updatedAt: mockUpdatedTicket.updatedAt.toISOString(),
      });
      expect(mockTicketService.updateTicket).toHaveBeenCalledWith(validId, {
        title: '  Updated Title  ',
        description: '  Updated Description  ',
        status: undefined,
        assignedTo: undefined,
      });
    });

    it('should return 400 when title is only whitespace', async () => {
      const validId = '507f1f77bcf86cd799439016';
      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: '   ',
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('title');
      expect(data.details[0].message).toBe('Le titre est requis');
    });

    it('should return 400 when title exceeds 200 characters', async () => {
      const validId = '507f1f77bcf86cd799439016';
      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'A'.repeat(201),
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('title');
      expect(data.details[0].message).toBe('Le titre ne doit pas dépasser 200 caractères');
    });

    it('should return 400 when description is only whitespace', async () => {
      const validId = '507f1f77bcf86cd799439016';
      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          description: '   ',
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('description');
      expect(data.details[0].message).toBe('La description est requise');
    });

    it('should return 400 when description exceeds 5000 characters', async () => {
      const validId = '507f1f77bcf86cd799439016';
      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          description: 'A'.repeat(5001),
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('description');
      expect(data.details[0].message).toBe('La description ne doit pas dépasser 5000 caractères');
    });
  });

  describe('Update all fields', () => {
    it('should update all fields together successfully', async () => {
      const validId = '507f1f77bcf86cd799439016';
      const assignedUserId = '507f1f77bcf86cd799439017';
      const mockUpdatedTicket = {
        id: validId,
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        createdBy: mockUserPublic1,
        assignedTo: mockUserPublic2,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T12:00:00Z'),
      };

      vi.mocked(mockTicketService.updateTicket).mockResolvedValue(mockUpdatedTicket);

      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'New Title',
          description: 'New Description',
          status: TicketStatus.RESOLVED,
          assignedTo: assignedUserId,
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockUpdatedTicket,
        createdAt: mockUpdatedTicket.createdAt.toISOString(),
        updatedAt: mockUpdatedTicket.updatedAt.toISOString(),
      });
      expect(mockTicketService.updateTicket).toHaveBeenCalledWith(validId, {
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: assignedUserId,
      });
    });
  });

  describe('Validation', () => {
    it('should return 400 when no fields provided', async () => {
      const validId = '507f1f77bcf86cd799439016';
      vi.mocked(mockTicketService.updateTicket).mockRejectedValue(
        new ValidationError('Au moins un champ doit être fourni pour la mise à jour')
      );

      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({}),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Au moins un champ doit être fourni pour la mise à jour' });
    });
  });

  describe('Error handling', () => {
    it('should return 404 when ticket not found', async () => {
      const validId = '507f191e810c19729de860ea';
      vi.mocked(mockTicketService.updateTicket).mockResolvedValue(null);

      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'New Title',
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Ticket non trouvé' });
    });

    it('should return 400 for invalid ObjectId format', async () => {
      const request = new NextRequest('http://localhost/api/tickets/invalid-id', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'New Title',
        }),
      });
      const params = Promise.resolve({ id: 'invalid-id' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'ID de ticket invalide' });
    });

    it('should return 500 when an error occurs', async () => {
      const validId = '507f1f77bcf86cd799439016';
      vi.mocked(mockTicketService.updateTicket).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest(`http://localhost/api/tickets/${validId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'New Title',
        }),
      });
      const params = Promise.resolve({ id: validId });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Erreur lors de la mise à jour du ticket' });
    });
  });
});
