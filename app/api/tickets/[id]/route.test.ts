import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH } from './route';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { TicketService } from '@/application/services/TicketService';
import { CreateTicket } from '@/domain/use-cases/CreateTicket';
import { GetTickets } from '@/domain/use-cases/GetTickets';
import { GetTicketById } from '@/domain/use-cases/GetTicketById';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { ValidationError } from '@/domain/errors/ValidationError';
import { UserPublic } from '@/domain/entities/User';

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mockAuth,
}));

vi.mock('@/application/services/ServiceFactory');

const mockUser: UserPublic = {
  id: '507f1f77bcf86cd799439016',
  firstName: 'Jean',
  lastName: 'Dupont',
};

const mockUser2: UserPublic = {
  id: '507f1f77bcf86cd799439017',
  firstName: 'Marie',
  lastName: 'Martin',
};

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
    const mockTicket = {
      id: '123',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: false,
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
    it('should update status and assignedTo successfully and trim whitespace', async () => {
      const mockUpdatedTicket = {
        id: '123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUser,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T11:00:00Z'),
      };

      vi.mocked(mockTicketService.updateTicket).mockResolvedValue(mockUpdatedTicket);

      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          status: TicketStatus.IN_PROGRESS,
          assignedTo: '  Jean Dupont  ',
        }),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockUpdatedTicket,
        createdAt: mockUpdatedTicket.createdAt.toISOString(),
        updatedAt: mockUpdatedTicket.updatedAt.toISOString(),
      });
      expect(mockTicketService.updateTicket).toHaveBeenCalledWith('123', {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: '  Jean Dupont  ',
        title: undefined,
        description: undefined,
      });
    });

    it('should return 400 when status is invalid', async () => {
      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'INVALID_STATUS',
        }),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('status');
      expect(data.details[0].message).toBe('Le statut est invalide');
    });

    it('should return 400 when assignedTo is empty string or only whitespace', async () => {
      vi.mocked(mockTicketService.updateTicket).mockRejectedValue(
        new ValidationError('Le nom de la personne assignée est obligatoire')
      );

      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          assignedTo: '   ',
        }),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Le nom de la personne assignée est obligatoire' });
    });
  });

  describe('Update title and description', () => {
    it('should update title and description successfully and trim whitespace', async () => {
      const mockUpdatedTicket = {
        id: '123',
        title: 'Updated Title',
        description: 'Updated Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T11:30:00Z'),
      };

      vi.mocked(mockTicketService.updateTicket).mockResolvedValue(mockUpdatedTicket);

      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          title: '  Updated Title  ',
          description: '  Updated Description  ',
        }),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockUpdatedTicket,
        createdAt: mockUpdatedTicket.createdAt.toISOString(),
        updatedAt: mockUpdatedTicket.updatedAt.toISOString(),
      });
      expect(mockTicketService.updateTicket).toHaveBeenCalledWith('123', {
        title: '  Updated Title  ',
        description: '  Updated Description  ',
        status: undefined,
        assignedTo: undefined,
      });
    });

    it('should return 400 when title is only whitespace', async () => {
      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          title: '   ',
        }),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('title');
      expect(data.details[0].message).toBe('Le titre est requis');
    });

    it('should return 400 when title exceeds 200 characters', async () => {
      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'A'.repeat(201),
        }),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('title');
      expect(data.details[0].message).toBe('Le titre ne doit pas dépasser 200 caractères');
    });

    it('should return 400 when description is only whitespace', async () => {
      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          description: '   ',
        }),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Données invalides');
      expect(data.details).toHaveLength(1);
      expect(data.details[0].field).toBe('description');
      expect(data.details[0].message).toBe('La description est requise');
    });

    it('should return 400 when description exceeds 5000 characters', async () => {
      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          description: 'A'.repeat(5001),
        }),
      });
      const params = Promise.resolve({ id: '123' });

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
      const mockUpdatedTicket = {
        id: '123',
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: mockUser2,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T12:00:00Z'),
      };

      vi.mocked(mockTicketService.updateTicket).mockResolvedValue(mockUpdatedTicket);

      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'New Title',
          description: 'New Description',
          status: TicketStatus.RESOLVED,
          assignedTo: 'Marie Martin',
        }),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockUpdatedTicket,
        createdAt: mockUpdatedTicket.createdAt.toISOString(),
        updatedAt: mockUpdatedTicket.updatedAt.toISOString(),
      });
      expect(mockTicketService.updateTicket).toHaveBeenCalledWith('123', {
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: 'Marie Martin',
      });
    });
  });

  describe('Validation', () => {
    it('should return 400 when no fields provided', async () => {
      vi.mocked(mockTicketService.updateTicket).mockRejectedValue(
        new ValidationError('Au moins un champ doit être fourni pour la mise à jour')
      );

      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({}),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Au moins un champ doit être fourni pour la mise à jour' });
    });
  });

  describe('Error handling', () => {
    it('should return 404 when ticket not found', async () => {
      vi.mocked(mockTicketService.updateTicket).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/tickets/non-existent', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'New Title',
        }),
      });
      const params = Promise.resolve({ id: 'non-existent' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Ticket non trouvé' });
    });

    it('should return 400 for invalid ObjectId format', async () => {
      vi.mocked(mockTicketService.updateTicket).mockRejectedValue(new InvalidIdError('invalid-id'));

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
      expect(data).toEqual({ error: 'ID invalide' });
    });

    it('should return 500 when an error occurs', async () => {
      vi.mocked(mockTicketService.updateTicket).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/tickets/123', {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'New Title',
        }),
      });
      const params = Promise.resolve({ id: '123' });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Erreur lors de la mise à jour du ticket' });
    });
  });
});
