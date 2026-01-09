import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTicket } from './UpdateTicket';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IEmailService } from '../services/IEmailService';
import { IEmailTemplateService } from '../services/IEmailTemplateService';
import { ILogger } from '../services/ILogger';
import { TicketStatus } from '../value-objects/TicketStatus';
import { User } from '../entities/User';
import { Ticket, UpdateTicketData } from '../entities/Ticket';
import { mockUser1, mockUser2, mockUserPublic1 } from '@tests/helpers/mockUsers';

describe('UpdateTicket', () => {
  const mockRepository: ITicketRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
  };

  const mockUserRepository: IUserRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
  };

  const mockEmailService: IEmailService = {
    send: vi.fn(),
    sendSafe: vi.fn(),
  };

  const mockEmailTemplateService: IEmailTemplateService = {
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

  const mockLogger: ILogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Update status and assignedTo', () => {
    it('should update status and assignedTo successfully', async () => {
      const existingTicket: Ticket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket: Ticket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUserPublic1,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      const updateTicketData: UpdateTicketData = {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUser1.id,
      };
      const result = await useCase.execute('1', updateTicketData);

      expect(result).toEqual(mockTicket);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUser1.id,
      });
    });

    it('should trim assignedTo', async () => {
      const existingTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUserPublic1,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: `  ${mockUser1.id}  `,
      });

      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUser1.id,
      });
    });
  });

  describe('Update title and description', () => {
    it('should update title and description successfully', async () => {
      const existingTicket = {
        id: '1',
        title: 'Old Title',
        description: 'Old Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Updated Title',
        description: 'Updated Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:30:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      const result = await useCase.execute('1', {
        title: 'Updated Title',
        description: 'Updated Description',
      });

      expect(result).toEqual(mockTicket);
      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        description: 'Updated Description',
      });
    });

    it('should trim title and description', async () => {
      const existingTicket = {
        id: '1',
        title: 'Old Title',
        description: 'Old Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Updated Title',
        description: 'Updated Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:30:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        title: '  Updated Title  ',
        description: '  Updated Description  ',
      });

      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        description: 'Updated Description',
      });
    });

    it('should update only title', async () => {
      const existingTicket = {
        id: '1',
        title: 'Old Title',
        description: 'Original Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'New Title',
        description: 'Original Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:30:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      const result = await useCase.execute('1', {
        title: 'New Title',
      });

      expect(result).toEqual(mockTicket);
      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        title: 'New Title',
      });
    });
  });

  describe('Update all fields', () => {
    it('should update all fields together', async () => {
      const existingTicket = {
        id: '1',
        title: 'Old Title',
        description: 'Old Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: mockUser2,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T12:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      const result = await useCase.execute('1', {
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: mockUser2.id,
      });

      expect(result).toEqual(mockTicket);
      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: mockUser2.id,
      });
    });
  });

  describe('Validation errors', () => {
    it('should throw error when no fields provided', async () => {
      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(useCase.execute('1', {})).rejects.toThrow(
        'Au moins un champ doit être fourni pour la mise à jour'
      );
    });

    it('should throw error when title is empty', async () => {
      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          title: '',
        })
      ).rejects.toThrow('Le titre est requis');
    });

    it('should throw error when title is only whitespace', async () => {
      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          title: '   ',
        })
      ).rejects.toThrow('Le titre est requis');
    });

    it('should throw error when title exceeds 200 characters', async () => {
      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          title: 'A'.repeat(201),
        })
      ).rejects.toThrow('Le titre ne doit pas dépasser 200 caractères');
    });

    it('should throw error when description is empty', async () => {
      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          description: '',
        })
      ).rejects.toThrow('La description est requise');
    });

    it('should throw error when description is only whitespace', async () => {
      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          description: '   ',
        })
      ).rejects.toThrow('La description est requise');
    });

    it('should throw error when description exceeds 5000 characters', async () => {
      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          description: 'A'.repeat(5001),
        })
      ).rejects.toThrow('La description ne doit pas dépasser 5000 caractères');
    });

    it('should throw error when status is invalid', async () => {
      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          status: 'INVALID_STATUS' as TicketStatus,
        })
      ).rejects.toThrow('Statut invalide');
    });

    it('should convert empty assignedTo to null', async () => {
      const existingTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: mockUserPublic1,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        assignedTo: '',
      });

      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        assignedTo: null,
      });
    });

    it('should convert whitespace-only assignedTo to null', async () => {
      const existingTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: mockUserPublic1,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        assignedTo: '   ',
      });

      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        assignedTo: null,
      });
    });
  });

  describe('Ticket not found', () => {
    it('should return null when ticket not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      const result = await useCase.execute('999', {
        title: 'New Title',
      });

      expect(result).toBeNull();
    });
  });

  describe('Archived ticket', () => {
    it('should throw error when trying to update an archived ticket', async () => {
      const archivedTicket = {
        id: '1',
        title: 'Archived Ticket',
        description: 'This ticket is archived',
        status: TicketStatus.CLOSED,
        assignedTo: null,
        archived: true,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(archivedTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          title: 'New Title',
        })
      ).rejects.toThrow('Un ticket archivé ne peut pas être modifié');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when trying to update status of archived ticket', async () => {
      const archivedTicket = {
        id: '1',
        title: 'Archived Ticket',
        description: 'This ticket is archived',
        status: TicketStatus.CLOSED,
        assignedTo: null,
        archived: true,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(archivedTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          status: TicketStatus.IN_PROGRESS,
        })
      ).rejects.toThrow('Un ticket archivé ne peut pas être modifié');
    });

    it('should throw error when trying to update assignedTo of archived ticket', async () => {
      const archivedTicket = {
        id: '1',
        title: 'Archived Ticket',
        description: 'This ticket is archived',
        status: TicketStatus.CLOSED,
        assignedTo: null,
        archived: true,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(archivedTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          assignedTo: mockUser1.id,
        })
      ).rejects.toThrow('Un ticket archivé ne peut pas être modifié');
    });
  });

  describe('Email notifications', () => {
    it('should send email notification when assigning a ticket', async () => {
      const existingTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: mockUserPublic1,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser1);
      vi.mocked(mockEmailService.sendSafe).mockResolvedValue(true);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        assignedTo: mockUser1.id,
      });

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser1.id);
      expect(mockEmailService.sendSafe).toHaveBeenCalled();
    });

    it('should send email notification when changing status', async () => {
      const existingTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      const mockUsers: User[] = [mockUser1, mockUser2];

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);
      vi.mocked(mockUserRepository.findAll).mockResolvedValue(mockUsers);
      vi.mocked(mockEmailService.sendSafe).mockResolvedValue(true);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        status: TicketStatus.IN_PROGRESS,
      });

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(mockEmailService.sendSafe).toHaveBeenCalled();
    });

    it('should not send email notification if status does not change', async () => {
      const existingTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Updated Title',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        title: 'Updated Title',
      });

      expect(mockEmailService.sendSafe).not.toHaveBeenCalled();
    });

    it('should not fail if email sending fails', async () => {
      const existingTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);
      vi.mocked(mockUserRepository.findAll).mockRejectedValue(new Error('Database error'));

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );

      const result = await useCase.execute('1', {
        status: TicketStatus.IN_PROGRESS,
      });

      expect(result).toEqual(mockTicket);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should not send email notification if assignee is not found', async () => {
      const existingTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      };

      const mockTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        assignedTo: mockUserPublic1,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingTicket);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);
      vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailService,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        assignedTo: mockUser1.id,
      });

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser1.id);
      expect(mockEmailService.sendSafe).not.toHaveBeenCalled();
    });
  });
});
