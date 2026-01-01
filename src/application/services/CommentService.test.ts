import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommentService } from './CommentService';
import { ICommentRepository } from '@/domain/repositories/ICommentRepository';
import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IEmailService } from '@/domain/services/IEmailService';
import { Comment, CreateCommentData } from '@/domain/entities/Comment';

describe('CommentService', () => {
  let mockRepository: ICommentRepository;
  let mockTicketRepository: ITicketRepository;
  let mockUserRepository: IUserRepository;
  let mockEmailService: IEmailService;
  let commentService: CommentService;

  beforeEach(() => {
    mockRepository = {
      findByTicketId: vi.fn(),
      create: vi.fn(),
    };
    mockTicketRepository = {
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      archive: vi.fn(),
    };
    mockUserRepository = {
      findAll: vi.fn().mockResolvedValue([]),
      findById: vi.fn().mockResolvedValue(null),
    };
    mockEmailService = {
      send: vi.fn().mockResolvedValue(undefined),
      sendSafe: vi.fn().mockResolvedValue(true),
    };
    commentService = new CommentService(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService
    );
  });

  describe('getCommentsByTicketId', () => {
    it('should return all comments for a ticket', async () => {
      const mockComments: Comment[] = [
        {
          id: '1',
          ticketId: 'ticket-123',
          content: 'Premier commentaire',
          author: 'Jean Dupont',
          createdAt: new Date('2025-01-15T10:00:00'),
        },
        {
          id: '2',
          ticketId: 'ticket-123',
          content: 'Deuxième commentaire',
          author: 'Marie Martin',
          createdAt: new Date('2025-01-15T11:00:00'),
        },
      ];

      vi.mocked(mockRepository.findByTicketId).mockResolvedValue(mockComments);

      const result = await commentService.getCommentsByTicketId('ticket-123');

      expect(result).toEqual(mockComments);
      expect(mockRepository.findByTicketId).toHaveBeenCalledWith('ticket-123');
      expect(mockRepository.findByTicketId).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no comments', async () => {
      vi.mocked(mockRepository.findByTicketId).mockResolvedValue([]);

      const result = await commentService.getCommentsByTicketId('ticket-456');

      expect(result).toEqual([]);
      expect(mockRepository.findByTicketId).toHaveBeenCalledWith('ticket-456');
      expect(mockRepository.findByTicketId).toHaveBeenCalledTimes(1);
    });
  });

  describe('addComment', () => {
    it('should add a comment with valid data', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: 'Nouveau commentaire',
        author: 'Jean Dupont',
      };

      const mockCreatedComment: Comment = {
        id: 'comment-1',
        ticketId: 'ticket-123',
        content: 'Nouveau commentaire',
        author: 'Jean Dupont',
        createdAt: new Date('2025-01-15T12:00:00'),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockCreatedComment);

      const result = await commentService.addComment(createData);

      expect(result).toEqual(mockCreatedComment);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ticketId: 'ticket-123',
        content: 'Nouveau commentaire',
        author: 'Jean Dupont',
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when ticketId is empty', async () => {
      const createData: CreateCommentData = {
        ticketId: '',
        content: 'Commentaire',
        author: 'Jean Dupont',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        "L'ID du ticket est requis"
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when content is empty', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: '',
        author: 'Jean Dupont',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        'Le contenu du commentaire est requis'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when author is empty', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: 'Commentaire',
        author: '',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        "L'auteur du commentaire est requis"
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when content exceeds 2000 characters', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: 'A'.repeat(2001),
        author: 'Jean Dupont',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        'Le commentaire ne doit pas dépasser 2000 caractères'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when author exceeds 100 characters', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: 'Commentaire',
        author: 'A'.repeat(101),
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        "L'auteur ne doit pas dépasser 100 caractères"
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should trim content and author before creating', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: '  Commentaire avec espaces  ',
        author: '  Jean Dupont  ',
      };

      const mockCreatedComment: Comment = {
        id: 'comment-1',
        ticketId: 'ticket-123',
        content: 'Commentaire avec espaces',
        author: 'Jean Dupont',
        createdAt: new Date('2025-01-15T12:00:00'),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockCreatedComment);

      await commentService.addComment(createData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ticketId: 'ticket-123',
        content: 'Commentaire avec espaces',
        author: 'Jean Dupont',
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when content is only whitespace', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: '   ',
        author: 'Jean Dupont',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        'Le contenu du commentaire est requis'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when author is only whitespace', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: 'Commentaire',
        author: '   ',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        "L'auteur du commentaire est requis"
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });
});
