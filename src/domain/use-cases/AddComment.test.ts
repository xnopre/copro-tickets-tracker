import { describe, it, expect, vi } from 'vitest';
import { AddComment } from './AddComment';
import { ICommentRepository } from '../repositories/ICommentRepository';

describe('AddComment', () => {
  const mockRepository: ICommentRepository = {
    findByTicketId: vi.fn(),
    create: vi.fn(),
  };

  it('should create a comment with valid data', async () => {
    const mockComment = {
      id: '1',
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: 'Jean Martin',
      createdAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockComment);

    const useCase = new AddComment(mockRepository);
    const result = await useCase.execute({
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: 'Jean Martin',
    });

    expect(result).toEqual(mockComment);
    expect(mockRepository.create).toHaveBeenCalledWith({
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: 'Jean Martin',
    });
  });

  it('should trim content and author', async () => {
    const mockComment = {
      id: '1',
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: 'Jean Martin',
      createdAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockComment);

    const useCase = new AddComment(mockRepository);
    await useCase.execute({
      ticketId: 'ticket-1',
      content: '  Test comment  ',
      author: '  Jean Martin  ',
    });

    expect(mockRepository.create).toHaveBeenCalledWith({
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: 'Jean Martin',
    });
  });

  it('should throw error when ticketId is empty', async () => {
    const useCase = new AddComment(mockRepository);

    await expect(
      useCase.execute({
        ticketId: '',
        content: 'Test comment',
        author: 'Jean Martin',
      })
    ).rejects.toThrow("L'ID du ticket est requis");
  });

  it('should throw error when content is empty', async () => {
    const useCase = new AddComment(mockRepository);

    await expect(
      useCase.execute({
        ticketId: 'ticket-1',
        content: '',
        author: 'Jean Martin',
      })
    ).rejects.toThrow('Le contenu du commentaire est requis');
  });

  it('should throw error when content exceeds 2000 characters', async () => {
    const useCase = new AddComment(mockRepository);

    await expect(
      useCase.execute({
        ticketId: 'ticket-1',
        content: 'A'.repeat(2001),
        author: 'Jean Martin',
      })
    ).rejects.toThrow('Le commentaire ne doit pas dépasser 2000 caractères');
  });

  it('should throw error when author is empty', async () => {
    const useCase = new AddComment(mockRepository);

    await expect(
      useCase.execute({
        ticketId: 'ticket-1',
        content: 'Test comment',
        author: '',
      })
    ).rejects.toThrow("L'auteur du commentaire est requis");
  });

  it('should throw error when author exceeds 100 characters', async () => {
    const useCase = new AddComment(mockRepository);

    await expect(
      useCase.execute({
        ticketId: 'ticket-1',
        content: 'Test comment',
        author: 'A'.repeat(101),
      })
    ).rejects.toThrow("L'auteur ne doit pas dépasser 100 caractères");
  });
});
