import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetUsers } from './GetUsers';
import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';

describe('GetUsers', () => {
  let mockRepository: IUserRepository;
  let getUsers: GetUsers;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
    };
    getUsers = new GetUsers(mockRepository);
  });

  it('should return all users', async () => {
    const users: User[] = [
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
      },
      {
        id: '2',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
      },
    ];

    vi.mocked(mockRepository.findAll).mockResolvedValue(users);

    const result = await getUsers.execute();

    expect(result).toEqual(users);
    expect(mockRepository.findAll).toHaveBeenCalledOnce();
  });

  it('should return empty array when no users exist', async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue([]);

    const result = await getUsers.execute();

    expect(result).toEqual([]);
    expect(mockRepository.findAll).toHaveBeenCalledOnce();
  });
});
