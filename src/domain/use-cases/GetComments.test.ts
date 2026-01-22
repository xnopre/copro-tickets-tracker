import { describe, expect, it, vi } from 'vitest';
import { GetComments } from './GetComments';
import { ICommentRepository } from '../repositories/ICommentRepository';
import { mockComment1, mockComment2, mockCommentsEmpty } from '@tests/helpers/mockComments';

describe('GetComments', () => {
  const mockRepository: ICommentRepository = {
    findByTicketId: vi.fn(),
    create: vi.fn(),
  };

  it('should get all comments for a ticket', async () => {
    const testComments = [mockComment1, mockComment2];

    vi.mocked(mockRepository.findByTicketId).mockResolvedValue(testComments);

    const useCase = new GetComments(mockRepository);
    const result = await useCase.execute('ticket-1');

    expect(result).toEqual(testComments);
    expect(mockRepository.findByTicketId).toHaveBeenCalledWith('ticket-1');
  });

  it('should return empty array when no comments', async () => {
    vi.mocked(mockRepository.findByTicketId).mockResolvedValue(mockCommentsEmpty);

    const useCase = new GetComments(mockRepository);
    const result = await useCase.execute('ticket-1');

    expect(result).toEqual(mockCommentsEmpty);
    expect(mockRepository.findByTicketId).toHaveBeenCalledWith('ticket-1');
  });
});
