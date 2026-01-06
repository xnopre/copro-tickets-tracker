import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MongoCommentRepository } from './MongoCommentRepository';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { CommentModel } from '../database/schemas/CommentSchema';

// Mock MongoDB connection
vi.mock('../database/mongodb', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

// Mock CommentModel
vi.mock('../database/schemas/CommentSchema', () => ({
  CommentModel: {
    find: vi.fn(),
    create: vi.fn(),
  },
}));

describe('MongoCommentRepository', () => {
  let repository: MongoCommentRepository;

  beforeEach(() => {
    repository = new MongoCommentRepository();
    vi.clearAllMocks();
  });

  describe('findByTicketId', () => {
    it('should throw InvalidIdError for invalid ObjectId format - short string', async () => {
      await expect(repository.findByTicketId('abc')).rejects.toThrow(InvalidIdError);
      await expect(repository.findByTicketId('abc')).rejects.toThrow('Invalid ID format: abc');
    });

    it('should throw InvalidIdError for invalid ObjectId format - numeric string', async () => {
      await expect(repository.findByTicketId('123')).rejects.toThrow(InvalidIdError);
      await expect(repository.findByTicketId('123')).rejects.toThrow('Invalid ID format: 123');
    });

    it('should throw InvalidIdError for empty string', async () => {
      await expect(repository.findByTicketId('')).rejects.toThrow(InvalidIdError);
      await expect(repository.findByTicketId('')).rejects.toThrow('Invalid ID format: ');
    });

    it('should throw InvalidIdError for invalid long string', async () => {
      await expect(repository.findByTicketId('not-a-valid-objectid-format')).rejects.toThrow(
        InvalidIdError
      );
      await expect(repository.findByTicketId('not-a-valid-objectid-format')).rejects.toThrow(
        'Invalid ID format: not-a-valid-objectid-format'
      );
    });

    it('should return empty array when no comments exist for ticket', async () => {
      const validTicketId = '507f1f77bcf86cd799439011';
      const mockFind = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: vi.fn().mockResolvedValue([]),
        }),
      });
      vi.mocked(CommentModel.find).mockImplementation(mockFind);

      const result = await repository.findByTicketId(validTicketId);

      expect(result).toEqual([]);
      expect(CommentModel.find).toHaveBeenCalledWith({ ticketId: validTicketId });
    });

    it('should return all comments for a ticket sorted by createdAt ascending', async () => {
      const validTicketId = '507f1f77bcf86cd799439011';
      const mockDocuments = [
        {
          _id: '507f1f77bcf86cd799439021',
          ticketId: validTicketId,
          content: 'First comment',
          authorId: {
            _id: 'user-1',
            firstName: 'Jean',
            lastName: 'Martin',
          },
          createdAt: new Date('2025-01-15T10:00:00.000Z'),
        },
        {
          _id: '507f1f77bcf86cd799439022',
          ticketId: validTicketId,
          content: 'Second comment',
          authorId: {
            _id: 'user-2',
            firstName: 'Marie',
            lastName: 'Dupont',
          },
          createdAt: new Date('2025-01-15T11:00:00.000Z'),
        },
      ];

      const mockFind = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: vi.fn().mockResolvedValue(mockDocuments),
        }),
      });
      vi.mocked(CommentModel.find).mockImplementation(mockFind);

      const result = await repository.findByTicketId(validTicketId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '507f1f77bcf86cd799439021',
        ticketId: validTicketId,
        content: 'First comment',
        author: {
          id: 'user-1',
          firstName: 'Jean',
          lastName: 'Martin',
          email: '',
        },
        createdAt: mockDocuments[0].createdAt,
      });
      expect(result[1]).toEqual({
        id: '507f1f77bcf86cd799439022',
        ticketId: validTicketId,
        content: 'Second comment',
        author: {
          id: 'user-2',
          firstName: 'Marie',
          lastName: 'Dupont',
          email: '',
        },
        createdAt: mockDocuments[1].createdAt,
      });
      expect(CommentModel.find).toHaveBeenCalledWith({ ticketId: validTicketId });
    });

    it('should call sort with createdAt: 1 (ascending)', async () => {
      const validTicketId = '507f1f77bcf86cd799439011';
      const mockSort = vi.fn().mockResolvedValue([]);
      const mockFind = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: mockSort,
        }),
      });
      vi.mocked(CommentModel.find).mockImplementation(mockFind);

      await repository.findByTicketId(validTicketId);

      expect(mockSort).toHaveBeenCalledWith({ createdAt: 1 });
    });

    it('should map multiple comments correctly', async () => {
      const validTicketId = '507f1f77bcf86cd799439011';
      const mockDocuments = [
        {
          _id: '507f1f77bcf86cd799439031',
          ticketId: validTicketId,
          content: 'Comment A',
          authorId: {
            _id: 'user-1',
            firstName: 'Jean',
            lastName: 'Martin',
          },
          createdAt: new Date('2025-01-15T09:00:00.000Z'),
        },
        {
          _id: '507f1f77bcf86cd799439032',
          ticketId: validTicketId,
          content: 'Comment B',
          authorId: {
            _id: 'user-2',
            firstName: 'Marie',
            lastName: 'Dupont',
          },
          createdAt: new Date('2025-01-15T10:00:00.000Z'),
        },
        {
          _id: '507f1f77bcf86cd799439033',
          ticketId: validTicketId,
          content: 'Comment C',
          authorId: {
            _id: 'user-3',
            firstName: 'Pierre',
            lastName: 'Bernard',
          },
          createdAt: new Date('2025-01-15T11:00:00.000Z'),
        },
      ];

      const mockFind = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: vi.fn().mockResolvedValue(mockDocuments),
        }),
      });
      vi.mocked(CommentModel.find).mockImplementation(mockFind);

      const result = await repository.findByTicketId(validTicketId);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('507f1f77bcf86cd799439031');
      expect(result[1].id).toBe('507f1f77bcf86cd799439032');
      expect(result[2].id).toBe('507f1f77bcf86cd799439033');
    });
  });

  describe('create', () => {
    it('should throw InvalidIdError for invalid ticketId format - short string', async () => {
      const createData = {
        ticketId: 'abc',
        content: 'Test comment',
        authorId: 'user-1',
      };

      await expect(repository.create(createData)).rejects.toThrow(InvalidIdError);
      await expect(repository.create(createData)).rejects.toThrow('Invalid ID format: abc');
    });

    it('should throw InvalidIdError for invalid ticketId format - numeric string', async () => {
      const createData = {
        ticketId: '123',
        content: 'Test comment',
        authorId: 'user-1',
      };

      await expect(repository.create(createData)).rejects.toThrow(InvalidIdError);
      await expect(repository.create(createData)).rejects.toThrow('Invalid ID format: 123');
    });

    it('should throw InvalidIdError for empty ticketId', async () => {
      const createData = {
        ticketId: '',
        content: 'Test comment',
        authorId: 'user-1',
      };

      await expect(repository.create(createData)).rejects.toThrow(InvalidIdError);
      await expect(repository.create(createData)).rejects.toThrow('Invalid ID format: ');
    });

    it('should throw InvalidIdError for invalid long ticketId', async () => {
      const createData = {
        ticketId: 'not-a-valid-objectid-format',
        content: 'Test comment',
        authorId: 'user-1',
      };

      await expect(repository.create(createData)).rejects.toThrow(InvalidIdError);
      await expect(repository.create(createData)).rejects.toThrow(
        'Invalid ID format: not-a-valid-objectid-format'
      );
    });

    it('should create a new comment with valid data', async () => {
      const validTicketId = '507f1f77bcf86cd799439011';
      const validAuthorId = '507f1f77bcf86cd799439099';
      const createData = {
        ticketId: validTicketId,
        content: 'New comment',
        authorId: validAuthorId,
      };

      const mockDocument = {
        _id: '507f1f77bcf86cd799439041',
        ticketId: validTicketId,
        content: 'New comment',
        authorId: {
          _id: validAuthorId,
          firstName: 'Jean',
          lastName: 'Martin',
        },
        createdAt: new Date('2025-01-15T12:00:00.000Z'),
        populate: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439041',
          ticketId: validTicketId,
          content: 'New comment',
          authorId: {
            _id: validAuthorId,
            firstName: 'Jean',
            lastName: 'Martin',
          },
          createdAt: new Date('2025-01-15T12:00:00.000Z'),
        }),
      };

      vi.mocked(CommentModel.create).mockResolvedValue(mockDocument as any);

      const result = await repository.create(createData);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439041',
        ticketId: validTicketId,
        content: 'New comment',
        author: {
          id: validAuthorId,
          firstName: 'Jean',
          lastName: 'Martin',
          email: '',
        },
        createdAt: mockDocument.createdAt,
      });
      expect(CommentModel.create).toHaveBeenCalledWith({
        ticketId: validTicketId,
        content: 'New comment',
        authorId: validAuthorId,
      });
    });

    it('should return comment with generated ID', async () => {
      const validTicketId = '507f1f77bcf86cd799439011';
      const validAuthorId = '507f1f77bcf86cd799439099';
      const createData = {
        ticketId: validTicketId,
        content: 'ID Test Comment',
        authorId: validAuthorId,
      };

      const mockDocument = {
        _id: '507f1f77bcf86cd799439042',
        ticketId: validTicketId,
        content: 'ID Test Comment',
        authorId: {
          _id: validAuthorId,
          firstName: 'Jean',
          lastName: 'Martin',
        },
        createdAt: new Date('2025-01-15T13:00:00.000Z'),
        populate: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439042',
          ticketId: validTicketId,
          content: 'ID Test Comment',
          authorId: {
            _id: validAuthorId,
            firstName: 'Jean',
            lastName: 'Martin',
          },
          createdAt: new Date('2025-01-15T13:00:00.000Z'),
        }),
      };

      vi.mocked(CommentModel.create).mockResolvedValue(mockDocument as any);

      const result = await repository.create(createData);

      expect(result.id).toBe('507f1f77bcf86cd799439042');
      expect(typeof result.id).toBe('string');
    });

    it('should map document fields correctly', async () => {
      const validTicketId = '507f1f77bcf86cd799439011';
      const validAuthorId = '507f1f77bcf86cd799439099';
      const createData = {
        ticketId: validTicketId,
        content: 'Detailed comment content',
        authorId: validAuthorId,
      };

      const createdDate = new Date('2025-01-15T14:30:00.000Z');

      const mockDocument = {
        _id: '507f1f77bcf86cd799439043',
        ticketId: validTicketId,
        content: 'Detailed comment content',
        authorId: {
          _id: validAuthorId,
          firstName: 'Jean',
          lastName: 'Martin',
        },
        createdAt: createdDate,
        populate: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439043',
          ticketId: validTicketId,
          content: 'Detailed comment content',
          authorId: {
            _id: validAuthorId,
            firstName: 'Jean',
            lastName: 'Martin',
          },
          createdAt: createdDate,
        }),
      };

      vi.mocked(CommentModel.create).mockResolvedValue(mockDocument as any);

      const result = await repository.create(createData);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439043',
        ticketId: validTicketId,
        content: 'Detailed comment content',
        author: {
          id: validAuthorId,
          firstName: 'Jean',
          lastName: 'Martin',
          email: '',
        },
        createdAt: createdDate,
      });
    });

    it('should preserve long content', async () => {
      const validTicketId = '507f1f77bcf86cd799439011';
      const validAuthorId = '507f1f77bcf86cd799439099';
      const longContent = 'A'.repeat(1500);
      const createData = {
        ticketId: validTicketId,
        content: longContent,
        authorId: validAuthorId,
      };

      const mockDocument = {
        _id: '507f1f77bcf86cd799439044',
        ticketId: validTicketId,
        content: longContent,
        authorId: {
          _id: validAuthorId,
          firstName: 'Jean',
          lastName: 'Martin',
        },
        createdAt: new Date('2025-01-15T15:00:00.000Z'),
        populate: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439044',
          ticketId: validTicketId,
          content: longContent,
          authorId: {
            _id: validAuthorId,
            firstName: 'Jean',
            lastName: 'Martin',
          },
          createdAt: new Date('2025-01-15T15:00:00.000Z'),
        }),
      };

      vi.mocked(CommentModel.create).mockResolvedValue(mockDocument as any);

      const result = await repository.create(createData);

      expect(result.content).toBe(longContent);
      expect(result.content.length).toBe(1500);
    });
  });
});
