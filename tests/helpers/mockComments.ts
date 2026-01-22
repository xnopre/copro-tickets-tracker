import { Comment } from '@/domain/entities/Comment';
import { mockUserPublic1, mockUserPublic2, mockUserPublic3 } from './mockUsers';

/**
 * Mock comments for testing purposes
 */

// Individual comments
export const mockComment1: Comment = {
  id: '1',
  ticketId: 'ticket-1',
  content: 'Premier commentaire',
  author: mockUserPublic1,
  createdAt: new Date('2025-01-15T10:30:00.000Z'),
};

export const mockComment2: Comment = {
  id: '2',
  ticketId: 'ticket-1',
  content: 'Deuxième commentaire',
  author: mockUserPublic2,
  createdAt: new Date('2025-01-15T11:00:00.000Z'),
};

export const mockComment3: Comment = {
  id: '3',
  ticketId: 'ticket-1',
  content: 'Troisième commentaire',
  author: mockUserPublic3,
  createdAt: new Date('2025-01-15T12:00:00.000Z'),
};

// Comment arrays for list tests
export const mockComments: Comment[] = [mockComment1, mockComment2, mockComment3];

export const mockCommentsEmpty: Comment[] = [];
