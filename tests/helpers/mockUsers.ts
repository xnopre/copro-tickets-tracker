import { User, UserPublic } from '@/domain/entities/User';

/**
 * Mock users for testing purposes
 */

export const mockUserPublic1: UserPublic = {
  id: '1',
  firstName: 'Jean',
  lastName: 'Dupont',
};

export const mockUserPublic2: UserPublic = {
  id: '2',
  firstName: 'Marie',
  lastName: 'Martin',
};

export const mockUserPublic3: UserPublic = {
  id: '3',
  firstName: 'Pierre',
  lastName: 'Bernard',
};

export const mockUser1: User = {
  ...mockUserPublic1,
  email: 'jean.dupont@example.com',
  password: 'password123',
};

export const mockUser2: User = {
  ...mockUserPublic2,
  email: 'marie.martin@example.com',
  password: 'password456',
};

export const mockUser3: User = {
  ...mockUserPublic3,
  email: 'pierre.bernard@example.com',
  password: 'password789',
};

export const mockUsers: User[] = [mockUser1, mockUser2, mockUser3];

export const mockUsersPublic: UserPublic[] = [mockUserPublic1, mockUserPublic2, mockUserPublic3];
