import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './AuthService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { hashPassword } from '../crypto/passwordUtils';

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
      const mockUser = {
        id: '123',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        password: undefined,
      };

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(mockUser);

      const result = await authService.validateCredentials('jean@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = {
        id: '123',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        password: '$2a$10$hashedpassword',
      };

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(mockUser);

      const result = await authService.validateCredentials('jean@example.com', 'wrongPassword');

      expect(result).toBeNull();
    });

    it('should return user without password when credentials are valid', async () => {
      const validPassword = 'mySecurePassword123';
      const hashedPassword = await hashPassword(validPassword);

      const mockUser = {
        id: '123',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        password: hashedPassword,
      };

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(mockUser);

      const result = await authService.validateCredentials('jean@example.com', validPassword);

      expect(result).toBeDefined();
      expect(result?.password).toBeUndefined();
      expect(result?.firstName).toBe('Jean');
      expect(result?.lastName).toBe('Dupont');
    });
  });
});
