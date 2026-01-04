import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetUserById } from './GetUserById';
import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';

describe('GetUserById', () => {
  let mockRepository: IUserRepository;
  let getUserById: GetUserById;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
    };
    getUserById = new GetUserById(mockRepository);
  });

  it('should return user when found', async () => {
    const user: User = {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(user);

    const result = await getUserById.execute('1');

    expect(result).toEqual(user);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should return null when user not found', async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const result = await getUserById.execute('999');

    expect(result).toBeNull();
    expect(mockRepository.findById).toHaveBeenCalledWith('999');
  });
});
