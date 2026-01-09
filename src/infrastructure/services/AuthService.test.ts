import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './AuthService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { hashPassword } from '../crypto/passwordUtils';
import { mockUser1 } from '@tests/helpers/mockUsers';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
    } as unknown as IUserRepository;

    authService = new AuthService(mockUserRepository);
  });

  describe('validateCredentials', () => {
    it('should return null when user not found', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null);

      const result = await authService.validateCredentials('nonexistent@example.com', 'password');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(result).toBeNull();
    });

    it('should return null when user has no password', async () => {
      const mockUserNoPassword = {
        ...mockUser1,
        password: undefined,
      };

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(mockUserNoPassword);

      const result = await authService.validateCredentials(mockUser1.email!, 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockUserWithHash = {
        ...mockUser1,
        password: '$2a$10$hashedpassword',
      };

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(mockUserWithHash);

      const result = await authService.validateCredentials(mockUser1.email!, 'wrongPassword');

      expect(result).toBeNull();
    });

    it('should return user without password when credentials are valid', async () => {
      const validPassword = 'mySecurePassword123';
      const hashedPassword = await hashPassword(validPassword);

      const mockUserWithValidHash = {
        ...mockUser1,
        password: hashedPassword,
      };

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(mockUserWithValidHash);

      const result = await authService.validateCredentials(mockUser1.email!, validPassword);

      expect(result).toBeDefined();
      expect(result?.password).toBeUndefined();
      expect(result?.firstName).toBe(mockUser1.firstName);
      expect(result?.lastName).toBe(mockUser1.lastName);
    });
  });
});
