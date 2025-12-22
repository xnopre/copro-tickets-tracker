import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import connectDB from '@/infrastructure/database/mongodb';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';

vi.mock('@/infrastructure/database/mongodb');
vi.mock('@/application/services/ServiceFactory');

describe('GET /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user when found', async () => {
    const mockUser = {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
    };

    const mockUserService = {
      getUsers: vi.fn(),
      getUserById: vi.fn().mockResolvedValue(mockUser),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const mockRequest = new Request('http://localhost/api/users/1');
    const mockParams = Promise.resolve({ id: '1' });

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(connectDB).toHaveBeenCalledOnce();
    expect(mockUserService.getUserById).toHaveBeenCalledWith('1');
    expect(response.status).toBe(200);
    expect(data).toEqual(mockUser);
  });

  it('should return 404 when user not found', async () => {
    const mockUserService = {
      getUsers: vi.fn(),
      getUserById: vi.fn().mockResolvedValue(null),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const mockRequest = new Request('http://localhost/api/users/999');
    const mockParams = Promise.resolve({ id: '999' });

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Utilisateur non trouvé' });
  });

  it('should return 400 on invalid ID', async () => {
    const mockUserService = {
      getUsers: vi.fn(),
      getUserById: vi.fn().mockRejectedValue(new InvalidIdError('invalid-id')),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const mockRequest = new Request('http://localhost/api/users/invalid-id');
    const mockParams = Promise.resolve({ id: 'invalid-id' });

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('invalid-id');
  });

  it('should return 500 on server error', async () => {
    const mockUserService = {
      getUsers: vi.fn(),
      getUserById: vi.fn().mockRejectedValue(new Error('Database error')),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const mockRequest = new Request('http://localhost/api/users/1');
    const mockParams = Promise.resolve({ id: '1' });

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: "Erreur lors de la récupération de l'utilisateur",
    });
  });
});
