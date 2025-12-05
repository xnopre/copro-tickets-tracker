import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MongoTicketRepository } from './MongoTicketRepository';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { TicketModel } from '../database/schemas/TicketSchema';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';

// Mock MongoDB connection
vi.mock('../database/mongodb', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

// Mock TicketModel
vi.mock('../database/schemas/TicketSchema', () => ({
  TicketModel: {
    findById: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
  },
}));

describe('MongoTicketRepository', () => {
  let repository: MongoTicketRepository;

  beforeEach(() => {
    repository = new MongoTicketRepository();
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return empty array when no tickets exist', async () => {
      const mockFind = vi.fn().mockReturnValue({
        sort: vi.fn().mockResolvedValue([]),
      });
      vi.mocked(TicketModel.find).mockImplementation(mockFind);

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(TicketModel.find).toHaveBeenCalled();
    });

    it('should return all tickets sorted by createdAt descending', async () => {
      const mockDocuments = [
        {
          _id: '507f1f77bcf86cd799439011',
          title: 'Recent Ticket',
          description: 'Description 1',
          status: TicketStatus.NEW,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          _id: '507f1f77bcf86cd799439012',
          title: 'Old Ticket',
          description: 'Description 2',
          status: TicketStatus.IN_PROGRESS,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      const mockFind = vi.fn().mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockDocuments),
      });
      vi.mocked(TicketModel.find).mockImplementation(mockFind);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '507f1f77bcf86cd799439011',
        title: 'Recent Ticket',
        description: 'Description 1',
        status: TicketStatus.NEW,
        createdAt: mockDocuments[0].createdAt,
        updatedAt: mockDocuments[0].updatedAt,
      });
      expect(result[1]).toEqual({
        id: '507f1f77bcf86cd799439012',
        title: 'Old Ticket',
        description: 'Description 2',
        status: TicketStatus.IN_PROGRESS,
        createdAt: mockDocuments[1].createdAt,
        updatedAt: mockDocuments[1].updatedAt,
      });
      expect(TicketModel.find).toHaveBeenCalled();
    });

    it('should call sort with createdAt: -1', async () => {
      const mockSort = vi.fn().mockResolvedValue([]);
      const mockFind = vi.fn().mockReturnValue({
        sort: mockSort,
      });
      vi.mocked(TicketModel.find).mockImplementation(mockFind);

      await repository.findAll();

      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  describe('findById', () => {
    it('should throw InvalidIdError for invalid ObjectId format - short string', async () => {
      await expect(repository.findById('abc')).rejects.toThrow(InvalidIdError);
      await expect(repository.findById('abc')).rejects.toThrow('Invalid ID format: abc');
    });

    it('should throw InvalidIdError for invalid ObjectId format - numeric string', async () => {
      await expect(repository.findById('123')).rejects.toThrow(InvalidIdError);
      await expect(repository.findById('123')).rejects.toThrow('Invalid ID format: 123');
    });

    it('should throw InvalidIdError for empty string', async () => {
      await expect(repository.findById('')).rejects.toThrow(InvalidIdError);
      await expect(repository.findById('')).rejects.toThrow('Invalid ID format: ');
    });

    it('should throw InvalidIdError for invalid long string', async () => {
      await expect(repository.findById('not-a-valid-objectid-format')).rejects.toThrow(
        InvalidIdError
      );
      await expect(repository.findById('not-a-valid-objectid-format')).rejects.toThrow(
        'Invalid ID format: not-a-valid-objectid-format'
      );
    });

    it('should return null for valid ObjectId that does not exist', async () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      vi.mocked(TicketModel.findById).mockResolvedValue(null);

      const result = await repository.findById(validObjectId);

      expect(result).toBeNull();
      expect(TicketModel.findById).toHaveBeenCalledWith(validObjectId);
    });

    it('should return ticket for valid existing ObjectId', async () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      const mockDocument = {
        _id: validObjectId,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(TicketModel.findById).mockResolvedValue(mockDocument as any);

      const result = await repository.findById(validObjectId);

      expect(result).toEqual({
        id: validObjectId,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        createdAt: mockDocument.createdAt,
        updatedAt: mockDocument.updatedAt,
      });
      expect(TicketModel.findById).toHaveBeenCalledWith(validObjectId);
    });
  });

  describe('create', () => {
    it('should create a new ticket with status NEW', async () => {
      const createData = {
        title: 'New Ticket',
        description: 'New Description',
      };

      const mockDocument = {
        _id: '507f1f77bcf86cd799439013',
        title: 'New Ticket',
        description: 'New Description',
        status: TicketStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(TicketModel.create).mockResolvedValue(mockDocument as any);

      const result = await repository.create(createData);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439013',
        title: 'New Ticket',
        description: 'New Description',
        status: TicketStatus.NEW,
        createdAt: mockDocument.createdAt,
        updatedAt: mockDocument.updatedAt,
      });
      expect(TicketModel.create).toHaveBeenCalledWith({
        title: 'New Ticket',
        description: 'New Description',
        status: TicketStatus.NEW,
      });
    });

    it('should always assign NEW status regardless of input', async () => {
      const createData = {
        title: 'Another Ticket',
        description: 'Another Description',
      };

      const mockDocument = {
        _id: '507f1f77bcf86cd799439014',
        title: 'Another Ticket',
        description: 'Another Description',
        status: TicketStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(TicketModel.create).mockResolvedValue(mockDocument as any);

      await repository.create(createData);

      expect(TicketModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: TicketStatus.NEW,
        })
      );
    });

    it('should return ticket with generated ID', async () => {
      const createData = {
        title: 'ID Test Ticket',
        description: 'Testing ID generation',
      };

      const mockDocument = {
        _id: '507f1f77bcf86cd799439015',
        title: 'ID Test Ticket',
        description: 'Testing ID generation',
        status: TicketStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(TicketModel.create).mockResolvedValue(mockDocument as any);

      const result = await repository.create(createData);

      expect(result.id).toBe('507f1f77bcf86cd799439015');
      expect(typeof result.id).toBe('string');
    });
  });
});
