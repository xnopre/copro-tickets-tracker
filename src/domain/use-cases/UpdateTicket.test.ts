import { describe, it, expect, vi } from 'vitest';
import { UpdateTicket } from './UpdateTicket';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { TicketStatus } from '../value-objects/TicketStatus';

describe('UpdateTicket', () => {
  const mockRepository: ITicketRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
  };

  describe('Update status and assignedTo', () => {
    it('should update status and assignedTo successfully', async () => {
      const mockTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: 'John Doe',
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(mockRepository);
      const result = await useCase.execute('1', {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: 'John Doe',
      });

      expect(result).toEqual(mockTicket);
      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: 'John Doe',
      });
    });

    it('should trim assignedTo', async () => {
      const mockTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: 'John Doe',
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T11:00:00.000Z'),
      };

      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(mockRepository);
      await useCase.execute('1', {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: '  John Doe  ',
      });

      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: 'John Doe',
      });
    });
  });

  describe('Update title and description', () => {
    it('should update title and description successfully', async () => {
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

      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(mockRepository);
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

      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(mockRepository);
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

      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(mockRepository);
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
      const mockTicket = {
        id: '1',
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: 'Jane Smith',
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T12:00:00.000Z'),
      };

      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(mockRepository);
      const result = await useCase.execute('1', {
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: 'Jane Smith',
      });

      expect(result).toEqual(mockTicket);
      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.RESOLVED,
        assignedTo: 'Jane Smith',
      });
    });
  });

  describe('Validation errors', () => {
    it('should throw error when no fields provided', async () => {
      const useCase = new UpdateTicket(mockRepository);

      await expect(useCase.execute('1', {})).rejects.toThrow(
        'Au moins un champ doit être fourni pour la mise à jour'
      );
    });

    it('should throw error when title is empty', async () => {
      const useCase = new UpdateTicket(mockRepository);

      await expect(
        useCase.execute('1', {
          title: '',
        })
      ).rejects.toThrow('Le titre est requis');
    });

    it('should throw error when title is only whitespace', async () => {
      const useCase = new UpdateTicket(mockRepository);

      await expect(
        useCase.execute('1', {
          title: '   ',
        })
      ).rejects.toThrow('Le titre est requis');
    });

    it('should throw error when title exceeds 200 characters', async () => {
      const useCase = new UpdateTicket(mockRepository);

      await expect(
        useCase.execute('1', {
          title: 'A'.repeat(201),
        })
      ).rejects.toThrow('Le titre ne doit pas dépasser 200 caractères');
    });

    it('should throw error when description is empty', async () => {
      const useCase = new UpdateTicket(mockRepository);

      await expect(
        useCase.execute('1', {
          description: '',
        })
      ).rejects.toThrow('La description est requise');
    });

    it('should throw error when description is only whitespace', async () => {
      const useCase = new UpdateTicket(mockRepository);

      await expect(
        useCase.execute('1', {
          description: '   ',
        })
      ).rejects.toThrow('La description est requise');
    });

    it('should throw error when description exceeds 5000 characters', async () => {
      const useCase = new UpdateTicket(mockRepository);

      await expect(
        useCase.execute('1', {
          description: 'A'.repeat(5001),
        })
      ).rejects.toThrow('La description ne doit pas dépasser 5000 caractères');
    });

    it('should throw error when status is invalid', async () => {
      const useCase = new UpdateTicket(mockRepository);

      await expect(
        useCase.execute('1', {
          status: 'INVALID_STATUS' as TicketStatus,
        })
      ).rejects.toThrow('Statut invalide');
    });

    it('should convert empty assignedTo to null', async () => {
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

      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(mockRepository);
      await useCase.execute('1', {
        assignedTo: '',
      });

      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        assignedTo: null,
      });
    });

    it('should convert whitespace-only assignedTo to null', async () => {
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

      vi.mocked(mockRepository.update).mockResolvedValue(mockTicket);

      const useCase = new UpdateTicket(mockRepository);
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
      vi.mocked(mockRepository.update).mockResolvedValue(null);

      const useCase = new UpdateTicket(mockRepository);
      const result = await useCase.execute('999', {
        title: 'New Title',
      });

      expect(result).toBeNull();
    });
  });
});
