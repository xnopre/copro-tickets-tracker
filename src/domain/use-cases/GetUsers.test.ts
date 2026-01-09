import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetUsers } from './GetUsers';
import { IUserRepository } from '../repositories/IUserRepository';
import { mockUserPublic1, mockUserPublic2 } from '@tests/helpers/mockUsers';

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
    const users = [
      { ...mockUserPublic1, email: 'jean.dupont@example.com' },
      { ...mockUserPublic2, email: 'marie.martin@example.com' },
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
