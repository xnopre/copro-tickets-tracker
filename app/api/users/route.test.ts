import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import connectDB from '@/infrastructure/database/mongodb';
import { mockUserPublic1, mockUserPublic2 } from '@tests/helpers/mockUsers';

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mockAuth,
}));

vi.mock('@/infrastructure/database/mongodb');
vi.mock('@/application/services/ServiceFactory');

describe('GET /api/users', () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } } as any);
    vi.clearAllMocks();
  });

  it('should return all users', async () => {
    const mockUsers = [mockUserPublic1, mockUserPublic2];

    const mockUserService = {
      getUsers: vi.fn().mockResolvedValue(mockUsers),
      getUserById: vi.fn(),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const response = await GET();
    const data = await response.json();

    expect(connectDB).toHaveBeenCalledOnce();
    expect(mockUserService.getUsers).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    expect(data).toEqual(mockUsers);
  });

  it('should return 500 on error', async () => {
    const mockUserService = {
      getUsers: vi.fn().mockRejectedValue(new Error('Database error')),
      getUserById: vi.fn(),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Erreur lors de la récupération des utilisateurs',
    });
  });

  it('should return empty array when no users exist', async () => {
    const mockUserService = {
      getUsers: vi.fn().mockResolvedValue([]),
      getUserById: vi.fn(),
      createUser: vi.fn(),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });
});
