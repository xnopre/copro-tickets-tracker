import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TicketService } from './TicketService';
import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IEmailService } from '@/domain/services/IEmailService';
import { IEmailTemplateService } from '@/domain/services/IEmailTemplateService';
import { ILogger } from '@/domain/services/ILogger';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { Ticket, CreateTicketData } from '@/domain/entities/Ticket';
import { UserPublic } from '@/domain/entities/User';

const mockUser: UserPublic = {
  id: '507f1f77bcf86cd799439016',
  firstName: 'Jean',
  lastName: 'Martin',
};

const mockUser2: UserPublic = {
  id: '507f1f77bcf86cd799439017',
  firstName: 'Marie',
  lastName: 'Dupont',
};

const mockUser3: UserPublic = {
  id: '507f1f77bcf86cd799439018',
  firstName: 'Admin',
  lastName: 'User',
};

describe('TicketService', () => {
  let mockRepository: ITicketRepository;
  let mockUserRepository: IUserRepository;
  let mockEmailService: IEmailService;
  let mockEmailTemplateService: IEmailTemplateService;
  let mockLogger: ILogger;
  let ticketService: TicketService;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      archive: vi.fn(),
    };
    mockUserRepository = {
      findAll: vi.fn().mockResolvedValue([]),
      findById: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue(null),
    };
    mockEmailService = {
      send: vi.fn().mockResolvedValue(undefined),
      sendSafe: vi.fn().mockResolvedValue(true),
    };
    mockEmailTemplateService = {
      ticketCreated: vi.fn().mockReturnValue({
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      }),
      ticketAssigned: vi.fn().mockReturnValue({
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      }),
      ticketStatusChanged: vi.fn().mockReturnValue({
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      }),
      commentAdded: vi.fn().mockReturnValue({
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      }),
    };
    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    };
    ticketService = new TicketService(
      mockRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );
  });

  describe('getAllTickets', () => {
    it('should return all tickets from repository', async () => {
      const mockTickets: Ticket[] = [
        {
          id: '1',
          title: 'Ticket 1',
          description: 'Description 1',
          status: TicketStatus.NEW,
          assignedTo: null,
          archived: false,
          createdAt: new Date('2025-01-15'),
          updatedAt: new Date('2025-01-15'),
        },
        {
          id: '2',
          title: 'Ticket 2',
          description: 'Description 2',
          status: TicketStatus.IN_PROGRESS,
          assignedTo: mockUser,
          archived: false,
          createdAt: new Date('2025-01-16'),
          updatedAt: new Date('2025-01-16'),
        },
      ];

      vi.mocked(mockRepository.findAll).mockResolvedValue(mockTickets);

      const result = await ticketService.getAllTickets();

      expect(result).toEqual(mockTickets);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no tickets', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([]);

      const result = await ticketService.getAllTickets();

      expect(result).toEqual([]);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTicket', () => {
    it('should create a ticket with valid data', async () => {
      const createData: CreateTicketData = {
        title: 'New Ticket',
        description: 'New Description',
      };

      const mockCreatedTicket: Ticket = {
        id: '123',
        title: 'New Ticket',
        description: 'New Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockCreatedTicket);

      const result = await ticketService.createTicket(createData);

      expect(result).toEqual(mockCreatedTicket);
      expect(mockRepository.create).toHaveBeenCalledWith({
        title: 'New Ticket',
        description: 'New Description',
      });
    });

    it('should throw error when title is empty', async () => {
      const createData: CreateTicketData = {
        title: '',
        description: 'Description',
      };

      await expect(ticketService.createTicket(createData)).rejects.toThrow('Le titre est requis');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when description is empty', async () => {
      const createData: CreateTicketData = {
        title: 'Title',
        description: '',
      };

      await expect(ticketService.createTicket(createData)).rejects.toThrow(
        'La description est requise'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when title exceeds 200 characters', async () => {
      const createData: CreateTicketData = {
        title: 'A'.repeat(201),
        description: 'Description',
      };

      await expect(ticketService.createTicket(createData)).rejects.toThrow(
        'Le titre ne doit pas dépasser 200 caractères'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when description exceeds 5000 characters', async () => {
      const createData: CreateTicketData = {
        title: 'Title',
        description: 'A'.repeat(5001),
      };

      await expect(ticketService.createTicket(createData)).rejects.toThrow(
        'La description ne doit pas dépasser 5000 caractères'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should trim title and description before creating', async () => {
      const createData: CreateTicketData = {
        title: '  Spaced Title  ',
        description: '  Spaced Description  ',
      };

      const mockCreatedTicket: Ticket = {
        id: '123',
        title: 'Spaced Title',
        description: 'Spaced Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockCreatedTicket);

      await ticketService.createTicket(createData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        title: 'Spaced Title',
        description: 'Spaced Description',
      });
    });
  });

  describe('getTicketById', () => {
    it('should return a ticket when found', async () => {
      const mockTicket: Ticket = {
        id: '123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-15'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicket);

      const result = await ticketService.getTicketById('123');

      expect(result).toEqual(mockTicket);
      expect(mockRepository.findById).toHaveBeenCalledWith('123');
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null when ticket not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      const result = await ticketService.getTicketById('non-existent-id');

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTicket', () => {
    it('should update a ticket with valid data', async () => {
      const updateData = {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: 'Jean Martin',
      };

      const existingTicket: Ticket = {
        id: '123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-15'),
      };

      const mockUpdatedTicket: Ticket = {
        id: '123',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUser,
        archived: false,
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-16'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockUpdatedTicket);

      const result = await ticketService.updateTicket('123', updateData);

      expect(result).toEqual(mockUpdatedTicket);
      expect(mockRepository.findById).toHaveBeenCalledWith('123');
      expect(mockRepository.update).toHaveBeenCalledWith('123', updateData);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should return null when ticket not found', async () => {
      const updateData = {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: 'Jean Martin',
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      const result = await ticketService.updateTicket('non-existent-id', updateData);

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should update ticket status to RESOLVED', async () => {
      const updateData = {
        status: TicketStatus.RESOLVED,
        assignedTo: 'Marie Dupont',
      };

      const existingTicket: Ticket = {
        id: '456',
        title: 'Bug Fix',
        description: 'Fix the login issue',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUser2,
        archived: false,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-15'),
      };

      const mockUpdatedTicket: Ticket = {
        id: '456',
        title: 'Bug Fix',
        description: 'Fix the login issue',
        status: TicketStatus.RESOLVED,
        assignedTo: mockUser2,
        archived: false,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-16'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockUpdatedTicket);

      const result = await ticketService.updateTicket('456', updateData);

      expect(result).toEqual(mockUpdatedTicket);
    });

    it('should update ticket status to CLOSED', async () => {
      const updateData = {
        status: TicketStatus.CLOSED,
        assignedTo: 'Admin',
      };

      const existingTicket: Ticket = {
        id: '789',
        title: 'Completed Task',
        description: 'Task completed successfully',
        status: TicketStatus.RESOLVED,
        assignedTo: mockUser3,
        archived: false,
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-15'),
      };

      const mockUpdatedTicket: Ticket = {
        id: '789',
        title: 'Completed Task',
        description: 'Task completed successfully',
        status: TicketStatus.CLOSED,
        assignedTo: mockUser3,
        archived: false,
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-16'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockUpdatedTicket);

      const result = await ticketService.updateTicket('789', updateData);

      expect(result).toEqual(mockUpdatedTicket);
    });
  });
});
