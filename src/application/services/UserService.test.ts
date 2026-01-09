import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './UserService';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { mockUser1, mockUser2, mockUserPublic1 } from '@tests/helpers/mockUsers';

describe('UserService', () => {
  let mockRepository: IUserRepository;
  let userService: UserService;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
    };
    userService = new UserService(mockRepository);
  });

  describe('getUsers', () => {
    it('should return users without passwords', async () => {
      const users = [mockUser1, mockUser2];

      vi.mocked(mockRepository.findAll).mockResolvedValue(users);

      const result = await userService.getUsers();

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[0]).not.toHaveProperty('email');
      expect(result[0]).toEqual(mockUserPublic1);
    });
  });

  describe('getUserById', () => {
    it('should return user without password when found', async () => {
      const user = { ...mockUserPublic1, email: 'jean.dupont@example.com' };

      vi.mocked(mockRepository.findById).mockResolvedValue(user);

      const result = await userService.getUserById('1');

      expect(result).not.toBeNull();
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('email');
      expect(result).toEqual(mockUserPublic1);
    });

    it('should return null when user not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      const result = await userService.getUserById('999');

      expect(result).toBeNull();
    });
  });
});
