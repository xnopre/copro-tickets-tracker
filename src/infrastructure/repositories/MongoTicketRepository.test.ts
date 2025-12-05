import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MongoTicketRepository } from './MongoTicketRepository';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { TicketModel } from '../database/schemas/TicketSchema';

// Mock MongoDB connection
vi.mock('../database/mongodb', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

// Mock TicketModel
vi.mock('../database/schemas/TicketSchema', () => ({
  TicketModel: {
    findById: vi.fn(),
  },
}));

describe('MongoTicketRepository', () => {
  let repository: MongoTicketRepository;

  beforeEach(() => {
    repository = new MongoTicketRepository();
    vi.clearAllMocks();
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
        status: 'NEW',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(TicketModel.findById).mockResolvedValue(mockDocument as any);

      const result = await repository.findById(validObjectId);

      expect(result).toEqual({
        id: validObjectId,
        title: 'Test Ticket',
        description: 'Test Description',
        status: 'NEW',
        createdAt: mockDocument.createdAt,
        updatedAt: mockDocument.updatedAt,
      });
      expect(TicketModel.findById).toHaveBeenCalledWith(validObjectId);
    });
  });
});
