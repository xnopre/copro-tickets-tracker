import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommentService } from './CommentService';
import { ICommentRepository } from '@/domain/repositories/ICommentRepository';
import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IEmailService } from '@/domain/services/IEmailService';
import { IEmailTemplateService } from '@/domain/services/IEmailTemplateService';
import { ILogger } from '@/domain/services/ILogger';
import { Comment, CreateCommentData } from '@/domain/entities/Comment';

describe('CommentService', () => {
  let mockRepository: ICommentRepository;
  let mockTicketRepository: ITicketRepository;
  let mockUserRepository: IUserRepository;
  let mockEmailService: IEmailService;
  let mockEmailTemplateService: IEmailTemplateService;
  let mockLogger: ILogger;
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
      findByEmail: vi.fn().mockResolvedValue(null),
    };
    mockEmailService = {
      send: vi.fn().mockResolvedValue(undefined),
      sendSafe: vi.fn().mockResolvedValue(true),
    };
    mockEmailTemplateService = {
      ticketCreated: vi.fn().mockReturnValue({
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      }),
      ticketAssigned: vi.fn().mockReturnValue({
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      }),
      ticketStatusChanged: vi.fn().mockReturnValue({
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      }),
      commentAdded: vi.fn().mockReturnValue({
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      }),
    };
    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    };
    commentService = new CommentService(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );
  });

  describe('getCommentsByTicketId', () => {
    it('should return all comments for a ticket', async () => {
      const mockComments: Comment[] = [
        {
          id: '1',
          ticketId: 'ticket-123',
          content: 'Premier commentaire',
          author: {
            id: 'user-1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean@example.com',
          },
          createdAt: new Date('2025-01-15T10:00:00'),
        },
        {
          id: '2',
          ticketId: 'ticket-123',
          content: 'Deuxième commentaire',
          author: {
            id: 'user-2',
            firstName: 'Marie',
            lastName: 'Martin',
            email: 'marie@example.com',
          },
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
        authorId: 'user-1',
      };

      const mockCreatedComment: Comment = {
        id: 'comment-1',
        ticketId: 'ticket-123',
        content: 'Nouveau commentaire',
        author: {
          id: 'user-1',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com',
        },
        createdAt: new Date('2025-01-15T12:00:00'),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockCreatedComment);

      const result = await commentService.addComment(createData);

      expect(result).toEqual(mockCreatedComment);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ticketId: 'ticket-123',
        content: 'Nouveau commentaire',
        authorId: 'user-1',
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when ticketId is empty', async () => {
      const createData: CreateCommentData = {
        ticketId: '',
        content: 'Commentaire',
        authorId: 'user-1',
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
        authorId: 'user-1',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        'Le contenu du commentaire est requis'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when authorId is empty', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: 'Commentaire',
        authorId: '',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        "L'ID de l'auteur est requis"
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when content exceeds 2000 characters', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: 'A'.repeat(2001),
        authorId: 'user-1',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        'Le commentaire ne doit pas dépasser 2000 caractères'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should trim content before creating', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: '  Commentaire avec espaces  ',
        authorId: 'user-1',
      };

      const mockCreatedComment: Comment = {
        id: 'comment-1',
        ticketId: 'ticket-123',
        content: 'Commentaire avec espaces',
        author: {
          id: 'user-1',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com',
        },
        createdAt: new Date('2025-01-15T12:00:00'),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockCreatedComment);

      await commentService.addComment(createData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ticketId: 'ticket-123',
        content: 'Commentaire avec espaces',
        authorId: 'user-1',
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when content is only whitespace', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: '   ',
        authorId: 'user-1',
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        'Le contenu du commentaire est requis'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });
});
