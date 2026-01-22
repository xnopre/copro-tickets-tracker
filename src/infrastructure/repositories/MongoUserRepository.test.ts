import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MongoUserRepository } from './MongoUserRepository';
import UserModel from '../database/schemas/UserSchema';
import { mockUser1, mockUser2 } from '@tests/helpers/mockUsers';

vi.mock('../database/schemas/UserSchema', () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
  },
}));

describe('MongoUserRepository', () => {
  let repository: MongoUserRepository;

  beforeEach(() => {
    repository = new MongoUserRepository();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return all users sorted by lastName and firstName', async () => {
      const mockUsers = [
        {
          _id: { toString: () => mockUser1.id },
          firstName: mockUser1.firstName,
          lastName: mockUser1.lastName,
          email: mockUser1.email,
        },
        {
          _id: { toString: () => mockUser2.id },
          firstName: mockUser2.firstName,
          lastName: mockUser2.lastName,
          email: mockUser2.email,
        },
      ];

      const sortMock = vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUsers),
      });

      vi.mocked(UserModel.find).mockReturnValue({
        sort: sortMock,
      } as any);

      const result = await repository.findAll();

      expect(UserModel.find).toHaveBeenCalledOnce();
      expect(sortMock).toHaveBeenCalledWith({ lastName: 1, firstName: 1 });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: mockUser1.id,
        firstName: mockUser1.firstName,
        lastName: mockUser1.lastName,
        email: mockUser1.email,
      });
      expect(result[1]).toEqual({
        id: mockUser2.id,
        firstName: mockUser2.firstName,
        lastName: mockUser2.lastName,
        email: mockUser2.email,
      });
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUserDoc = {
        _id: { toString: () => mockUser1.id },
        firstName: mockUser1.firstName,
        lastName: mockUser1.lastName,
        email: mockUser1.email,
      };

      vi.mocked(UserModel.findById).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUserDoc),
      } as any);

      const result = await repository.findById(mockUser1.id);

      expect(UserModel.findById).toHaveBeenCalledWith(mockUser1.id);
      expect(result).toEqual({
        id: mockUser1.id,
        firstName: mockUser1.firstName,
        lastName: mockUser1.lastName,
        email: mockUser1.email,
      });
    });

    it('should return null when user not found', async () => {
      vi.mocked(UserModel.findById).mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as any);

      const result = await repository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user with password when found', async () => {
      const mockUserDoc = {
        _id: { toString: () => mockUser1.id },
        firstName: mockUser1.firstName,
        lastName: mockUser1.lastName,
        email: mockUser1.email,
        password: mockUser1.password,
      };

      const selectMock = vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUserDoc),
      });

      vi.mocked(UserModel.findOne).mockReturnValue({
        select: selectMock,
      } as any);

      const result = await repository.findByEmail(mockUser1.email!);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: mockUser1.email,
      });
      expect(selectMock).toHaveBeenCalledWith('+password');
      expect(result).toEqual({
        id: mockUser1.id,
        firstName: mockUser1.firstName,
        lastName: mockUser1.lastName,
        email: mockUser1.email,
        password: mockUser1.password,
      });
    });

    it('should return null when user not found by email', async () => {
      const selectMock = vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      });

      vi.mocked(UserModel.findOne).mockReturnValue({
        select: selectMock,
      } as any);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});
