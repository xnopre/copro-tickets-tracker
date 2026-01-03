import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MongoUserRepository } from './MongoUserRepository';
import UserModel from '../database/schemas/UserSchema';

vi.mock('../database/schemas/UserSchema', () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
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
          _id: { toString: () => '1' },
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com',
        },
        {
          _id: { toString: () => '2' },
          firstName: 'Marie',
          lastName: 'Martin',
          email: 'marie.martin@example.com',
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
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
      });
      expect(result[1]).toEqual({
        id: '2',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
      });
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        _id: { toString: () => '1' },
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
      };

      vi.mocked(UserModel.findById).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await repository.findById('1');

      expect(UserModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
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
});
