import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MongoTicketRepository } from './MongoTicketRepository';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { TicketModel } from '../database/schemas/TicketSchema';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { mockUserPublic1 } from '@tests/helpers/mockUsers';

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
    findByIdAndUpdate: vi.fn(),
  },
}));

const validObjectId = '507f1f77bcf86cd799439011';

describe('MongoTicketRepository', () => {
  let repository: MongoTicketRepository;

  beforeEach(() => {
    repository = new MongoTicketRepository();
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return empty array when no tickets exist', async () => {
      const mockFind = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockReturnValue({
            sort: vi.fn().mockResolvedValue([]),
          }),
        }),
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
          createdBy: { _id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
          assignedTo: null,
          archived: false,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          _id: '507f1f77bcf86cd799439012',
          title: 'Old Ticket',
          description: 'Description 2',
          status: TicketStatus.IN_PROGRESS,
          createdBy: { _id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
          assignedTo: null,
          archived: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      const mockFind = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockReturnValue({
            sort: vi.fn().mockResolvedValue(mockDocuments),
          }),
        }),
      });
      vi.mocked(TicketModel.find).mockImplementation(mockFind);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '507f1f77bcf86cd799439011',
        title: 'Recent Ticket',
        description: 'Description 1',
        status: TicketStatus.NEW,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: mockDocuments[0].createdAt,
        updatedAt: mockDocuments[0].updatedAt,
      });
      expect(result[1]).toEqual({
        id: '507f1f77bcf86cd799439012',
        title: 'Old Ticket',
        description: 'Description 2',
        status: TicketStatus.IN_PROGRESS,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: mockDocuments[1].createdAt,
        updatedAt: mockDocuments[1].updatedAt,
      });
      expect(TicketModel.find).toHaveBeenCalled();
    });

    it('should call sort with createdAt: -1', async () => {
      const mockSort = vi.fn().mockResolvedValue([]);
      const mockPopulate2 = vi.fn().mockReturnValue({
        sort: mockSort,
      });
      const mockPopulate1 = vi.fn().mockReturnValue({
        populate: mockPopulate2,
      });
      const mockFind = vi.fn().mockReturnValue({
        populate: mockPopulate1,
      });
      vi.mocked(TicketModel.find).mockImplementation(mockFind);

      await repository.findAll();

      expect(TicketModel.find).toHaveBeenCalledWith({});
      expect(mockPopulate1).toHaveBeenCalledWith('createdBy');
      expect(mockPopulate2).toHaveBeenCalledWith('assignedTo');
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
      const mockFindById = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(null),
        }),
      });
      vi.mocked(TicketModel.findById).mockImplementation(mockFindById);

      const result = await repository.findById(validObjectId);

      expect(result).toBeNull();
      expect(TicketModel.findById).toHaveBeenCalledWith(validObjectId);
    });

    it('should return ticket for valid existing ObjectId', async () => {
      const mockDocument = {
        _id: validObjectId,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        createdBy: { _id: validObjectId, ...mockUserPublic1 },
        assignedTo: null,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFindById = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockDocument),
        }),
      });
      vi.mocked(TicketModel.findById).mockImplementation(mockFindById);

      const result = await repository.findById(validObjectId);

      expect(result).toEqual({
        id: validObjectId,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.NEW,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
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
        createdBy: validObjectId,
      };

      const mockDocument = {
        _id: '507f1f77bcf86cd799439013',
        title: 'New Ticket',
        description: 'New Description',
        status: TicketStatus.NEW,
        createdBy: { _id: validObjectId, ...mockUserPublic1 },
        assignedTo: null,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        populate: vi.fn().mockReturnThis(),
      };

      vi.mocked(TicketModel.create).mockResolvedValue(mockDocument as any);

      const result = await repository.create(createData);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439013',
        title: 'New Ticket',
        description: 'New Description',
        status: TicketStatus.NEW,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: mockDocument.createdAt,
        updatedAt: mockDocument.updatedAt,
      });
    });

    it('should always assign NEW status regardless of input', async () => {
      const createData = {
        title: 'Another Ticket',
        description: 'Another Description',
        createdBy: validObjectId,
      };

      const mockDocument = {
        _id: '507f1f77bcf86cd799439014',
        title: 'Another Ticket',
        description: 'Another Description',
        status: TicketStatus.NEW,
        createdBy: { _id: validObjectId, ...mockUserPublic1 },
        createdAt: new Date(),
        updatedAt: new Date(),
        populate: vi.fn().mockReturnThis(),
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
        createdBy: validObjectId,
      };

      const mockDocument = {
        _id: '507f1f77bcf86cd799439015',
        title: 'ID Test Ticket',
        description: 'Testing ID generation',
        status: TicketStatus.NEW,
        createdBy: { _id: validObjectId, ...mockUserPublic1 },
        createdAt: new Date(),
        updatedAt: new Date(),
        populate: vi.fn().mockReturnThis(),
      };

      vi.mocked(TicketModel.create).mockResolvedValue(mockDocument as any);

      const result = await repository.create(createData);

      expect(result.id).toBe('507f1f77bcf86cd799439015');
      expect(typeof result.id).toBe('string');
    });
  });

  describe('update', () => {
    it('should throw InvalidIdError for invalid ObjectId format', async () => {
      const updateData = {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: '507f1f77bcf86cd799439016',
      };

      await expect(repository.update('abc', updateData)).rejects.toThrow(InvalidIdError);
      await expect(repository.update('abc', updateData)).rejects.toThrow('Invalid ID format: abc');
      await expect(repository.update('123', updateData)).rejects.toThrow(InvalidIdError);
      await expect(repository.update('', updateData)).rejects.toThrow(InvalidIdError);
    });

    it('should return null when ticket does not exist', async () => {
      const updateData = {
        status: TicketStatus.RESOLVED,
        assignedTo: '507f1f77bcf86cd799439016',
      };

      const mockFindByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(null),
        }),
      });
      vi.mocked(TicketModel.findByIdAndUpdate).mockImplementation(mockFindByIdAndUpdate);

      const result = await repository.update(validObjectId, updateData);

      expect(result).toBeNull();
    });

    it('should update ticket with valid data', async () => {
      const updateData = {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: '507f1f77bcf86cd799439016',
      };

      const mockDocument = {
        _id: validObjectId,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        createdBy: { _id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-20T14:30:00.000Z'),
      };

      const mockFindByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockDocument),
        }),
      });
      vi.mocked(TicketModel.findByIdAndUpdate).mockImplementation(mockFindByIdAndUpdate);

      const result = await repository.update(validObjectId, updateData);

      expect(result).toEqual({
        id: validObjectId,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.IN_PROGRESS,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: mockDocument.createdAt,
        updatedAt: mockDocument.updatedAt,
      });
    });

    it('should call findByIdAndUpdate with correct options', async () => {
      const updateData = {
        status: TicketStatus.RESOLVED,
        assignedTo: '507f1f77bcf86cd799439017',
      };

      const mockDocument = {
        _id: validObjectId,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.RESOLVED,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFindByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockDocument),
        }),
      });
      vi.mocked(TicketModel.findByIdAndUpdate).mockImplementation(mockFindByIdAndUpdate);

      await repository.update(validObjectId, updateData);

      expect(TicketModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should update ticket to CLOSED status', async () => {
      const updateData = {
        status: TicketStatus.CLOSED,
        assignedTo: '507f1f77bcf86cd799439018',
      };

      const mockDocument = {
        _id: validObjectId,
        title: 'Closed Ticket',
        description: 'This ticket is now closed',
        status: TicketStatus.CLOSED,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-10T09:00:00.000Z'),
        updatedAt: new Date('2025-01-25T16:00:00.000Z'),
      };

      const mockFindByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockDocument),
        }),
      });
      vi.mocked(TicketModel.findByIdAndUpdate).mockImplementation(mockFindByIdAndUpdate);

      const result = await repository.update(validObjectId, updateData);

      expect(result).not.toBeNull();
      expect(result?.status).toBe(TicketStatus.CLOSED);
      expect(result?.assignedTo).toBeNull();
    });

    it('should map document fields correctly', async () => {
      const updateData = {
        status: TicketStatus.RESOLVED,
        assignedTo: '507f1f77bcf86cd799439019',
      };

      const createdDate = new Date('2025-01-01T10:00:00.000Z');
      const updatedDate = new Date('2025-01-20T15:30:00.000Z');

      const mockDocument = {
        _id: validObjectId,
        title: 'Original Title',
        description: 'Original Description',
        status: TicketStatus.RESOLVED,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: createdDate,
        updatedAt: updatedDate,
      };

      const mockFindByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockDocument),
        }),
      });
      vi.mocked(TicketModel.findByIdAndUpdate).mockImplementation(mockFindByIdAndUpdate);

      const result = await repository.update(validObjectId, updateData);

      expect(result).toEqual({
        id: validObjectId,
        title: 'Original Title',
        description: 'Original Description',
        status: TicketStatus.RESOLVED,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: createdDate,
        updatedAt: updatedDate,
      });
    });

    it('should update ticket title', async () => {
      const updateData = {
        title: 'Updated Title',
      };

      const mockDocument = {
        _id: validObjectId,
        title: 'Updated Title',
        description: 'Original Description',
        status: TicketStatus.NEW,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-01T10:00:00.000Z'),
        updatedAt: new Date('2025-01-20T15:30:00.000Z'),
      };

      const mockFindByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockDocument),
        }),
      });
      vi.mocked(TicketModel.findByIdAndUpdate).mockImplementation(mockFindByIdAndUpdate);

      const result = await repository.update(validObjectId, updateData);

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Updated Title');
      expect(TicketModel.findByIdAndUpdate).toHaveBeenCalledWith(
        validObjectId,
        { title: 'Updated Title' },
        { new: true, runValidators: true }
      );
    });

    it('should update ticket description', async () => {
      const updateData = {
        description: 'Updated Description',
      };

      const mockDocument = {
        _id: validObjectId,
        title: 'Original Title',
        description: 'Updated Description',
        status: TicketStatus.NEW,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-01T10:00:00.000Z'),
        updatedAt: new Date('2025-01-20T15:30:00.000Z'),
      };

      const mockFindByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockDocument),
        }),
      });
      vi.mocked(TicketModel.findByIdAndUpdate).mockImplementation(mockFindByIdAndUpdate);

      const result = await repository.update(validObjectId, updateData);

      expect(result).not.toBeNull();
      expect(result?.description).toBe('Updated Description');
      expect(TicketModel.findByIdAndUpdate).toHaveBeenCalledWith(
        validObjectId,
        { description: 'Updated Description' },
        { new: true, runValidators: true }
      );
    });

    it('should update multiple fields simultaneously', async () => {
      const updateData = {
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: '507f1f77bcf86cd799439020',
      };

      const mockDocument = {
        _id: validObjectId,
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.IN_PROGRESS,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: new Date('2025-01-01T10:00:00.000Z'),
        updatedAt: new Date('2025-01-20T15:30:00.000Z'),
      };

      const mockFindByIdAndUpdate = vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockDocument),
        }),
      });
      vi.mocked(TicketModel.findByIdAndUpdate).mockImplementation(mockFindByIdAndUpdate);

      const result = await repository.update(validObjectId, updateData);

      expect(result).toEqual({
        id: validObjectId,
        title: 'New Title',
        description: 'New Description',
        status: TicketStatus.IN_PROGRESS,
        createdBy: { id: validObjectId, firstName: 'Jean', lastName: 'Dupont' },
        assignedTo: null,
        archived: false,
        createdAt: mockDocument.createdAt,
        updatedAt: mockDocument.updatedAt,
      });
    });
  });
});
