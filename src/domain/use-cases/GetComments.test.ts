import { describe, it, expect, vi } from 'vitest';
import { GetComments } from './GetComments';
import { ICommentRepository } from '../repositories/ICommentRepository';

describe('GetComments', () => {
  const mockRepository: ICommentRepository = {
    findByTicketId: vi.fn(),
    create: vi.fn(),
  };

  it('should get all comments for a ticket', async () => {
    const mockComments = [
      {
        id: '1',
        ticketId: 'ticket-1',
        content: 'Premier commentaire',
        author: {
          id: 'user-1',
          firstName: 'Jean',
          lastName: 'Martin',
          email: 'jean@example.com',
        },
        createdAt: new Date('2025-01-15T10:00:00'),
      },
      {
        id: '2',
        ticketId: 'ticket-1',
        content: 'Deuxième commentaire',
        author: {
          id: 'user-2',
          firstName: 'Marie',
          lastName: 'Dubois',
          email: 'marie@example.com',
        },
        createdAt: new Date('2025-01-15T11:00:00'),
      },
    ];

    vi.mocked(mockRepository.findByTicketId).mockResolvedValue(mockComments);

    const useCase = new GetComments(mockRepository);
    const result = await useCase.execute('ticket-1');

    expect(result).toEqual(mockComments);
    expect(mockRepository.findByTicketId).toHaveBeenCalledWith('ticket-1');
  });

  it('should return empty array when no comments', async () => {
    vi.mocked(mockRepository.findByTicketId).mockResolvedValue([]);

    const useCase = new GetComments(mockRepository);
    const result = await useCase.execute('ticket-1');

    expect(result).toEqual([]);
    expect(mockRepository.findByTicketId).toHaveBeenCalledWith('ticket-1');
  });
});
