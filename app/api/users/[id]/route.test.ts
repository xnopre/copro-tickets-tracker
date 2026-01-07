import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { ServiceFactory } from '@/application/services/ServiceFactory';
import connectDB from '@/infrastructure/database/mongodb';
import { InvalidIdError } from '@/domain/errors/InvalidIdError';
import { UserPublic } from '@/domain/entities/User';

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mockAuth,
}));

vi.mock('@/infrastructure/database/mongodb');
vi.mock('@/application/services/ServiceFactory');

describe('GET /api/users/[id]', () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } } as any);
    vi.clearAllMocks();
  });

  it('should return user when found', async () => {
    const validId = '507f1f77bcf86cd799439016';
    const mockUser: UserPublic = {
      id: validId,
      firstName: 'Jean',
      lastName: 'Dupont',
    };

    const mockUserService = {
      getUsers: vi.fn(),
      getUserById: vi.fn().mockResolvedValue(mockUser),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const mockRequest = new Request(`http://localhost/api/users/${validId}`);
    const mockParams = Promise.resolve({ id: validId });

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(connectDB).toHaveBeenCalledOnce();
    expect(mockUserService.getUserById).toHaveBeenCalledWith(validId);
    expect(response.status).toBe(200);
    expect(data).toEqual(mockUser);
  });

  it('should return 404 when user not found', async () => {
    const validId = '507f191e810c19729de860ea';
    const mockUserService = {
      getUsers: vi.fn(),
      getUserById: vi.fn().mockResolvedValue(null),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const mockRequest = new Request(`http://localhost/api/users/${validId}`);
    const mockParams = Promise.resolve({ id: validId });

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Utilisateur non trouvé' });
  });

  it('should return 400 on invalid ID', async () => {
    const mockRequest = new Request('http://localhost/api/users/invalid-id');
    const mockParams = Promise.resolve({ id: 'invalid-id' });

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('ID utilisateur invalide');
  });

  it('should return 500 on server error', async () => {
    const validId = '507f1f77bcf86cd799439016';
    const mockUserService = {
      getUsers: vi.fn(),
      getUserById: vi.fn().mockRejectedValue(new Error('Database error')),
    };

    vi.mocked(ServiceFactory.getUserService).mockReturnValue(mockUserService as any);

    const mockRequest = new Request(`http://localhost/api/users/${validId}`);
    const mockParams = Promise.resolve({ id: validId });

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: "Erreur lors de la récupération de l'utilisateur",
    });
  });
});
