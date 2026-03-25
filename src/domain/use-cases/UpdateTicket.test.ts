import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateTicket } from './UpdateTicket';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IEmailJobQueue } from '../services/IEmailJobQueue';
import { IEmailTemplateService } from '../services/IEmailTemplateService';
import { ILogger } from '../services/ILogger';
import { TicketStatus } from '../value-objects/TicketStatus';
import { User } from '../entities/User';
import { UpdateTicketData } from '../entities/Ticket';
import { mockUser1, mockUser2 } from '@tests/helpers/mockUsers';
import {
  mockTicketArchivedNew,
  mockTicketInProgress,
  mockTicketNew,
} from '@tests/helpers/mockTickets';

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

  const mockEmailJobQueue: IEmailJobQueue = {
    enqueue: vi.fn(),
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
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
        mockEmailTemplateService,
        mockLogger
      );
      const updateTicketData: UpdateTicketData = {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUser1.id,
      };
      const result = await useCase.execute('1', updateTicketData);

      expect(result).toEqual(mockTicketInProgress);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: mockUser1.id,
      });
    });

    it('should trim assignedTo', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
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
    it('should trim title and description', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
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
  });

  describe('Update all fields', () => {
    it('should update all fields together', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
        mockEmailTemplateService,
        mockLogger
      );
      const result = await useCase.execute('1', {
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: mockUser2.id,
      });

      expect(result).toEqual(mockTicketInProgress);
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
        mockEmailJobQueue,
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
        mockEmailJobQueue,
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
        mockEmailJobQueue,
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
        mockEmailJobQueue,
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
        mockEmailJobQueue,
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
        mockEmailJobQueue,
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
        mockEmailJobQueue,
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
        mockEmailJobQueue,
        mockEmailTemplateService,
        mockLogger
      );

      await expect(
        useCase.execute('1', {
          status: 'INVALID_STATUS' as TicketStatus,
        })
      ).rejects.toThrow('Statut invalide');
    });

    it('should convert whitespace-only assignedTo to null', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
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
        mockEmailJobQueue,
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
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketArchivedNew);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
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
  });

  describe('Email notifications', () => {
    it('should enqueue email notification when assigning a ticket', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser1);
      vi.mocked(mockEmailJobQueue.enqueue).mockResolvedValue(undefined);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        assignedTo: mockUser1.id,
      });

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser1.id);
      expect(mockEmailJobQueue.enqueue).toHaveBeenCalled();
    });

    it('should enqueue email notification when changing status', async () => {
      const mockUsers: User[] = [mockUser1, mockUser2];

      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);
      vi.mocked(mockUserRepository.findAll).mockResolvedValue(mockUsers);
      vi.mocked(mockEmailJobQueue.enqueue).mockResolvedValue(undefined);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        status: TicketStatus.IN_PROGRESS,
      });

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(mockEmailJobQueue.enqueue).toHaveBeenCalled();
    });

    it('should not enqueue email notification if status does not change', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        title: 'Updated Title',
      });

      expect(mockEmailJobQueue.enqueue).not.toHaveBeenCalled();
    });

    it('should not fail if email enqueue fails', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);
      vi.mocked(mockUserRepository.findAll).mockRejectedValue(new Error('Database error'));

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
        mockEmailTemplateService,
        mockLogger
      );

      const result = await useCase.execute('1', {
        status: TicketStatus.IN_PROGRESS,
      });

      expect(result).toEqual(mockTicketInProgress);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should not enqueue email notification if assignee is not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockTicketNew);
      vi.mocked(mockRepository.update).mockResolvedValue(mockTicketInProgress);
      vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

      const useCase = new UpdateTicket(
        mockRepository,
        mockUserRepository,
        mockEmailJobQueue,
        mockEmailTemplateService,
        mockLogger
      );
      await useCase.execute('1', {
        assignedTo: mockUser1.id,
      });

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser1.id);
      expect(mockEmailJobQueue.enqueue).not.toHaveBeenCalled();
    });
  });
});
