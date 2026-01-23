import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommentService } from './CommentService';
import { ICommentRepository } from '@/domain/repositories/ICommentRepository';
import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IEmailService } from '@/domain/services/IEmailService';
import { IEmailTemplateService } from '@/domain/services/IEmailTemplateService';
import { ILogger } from '@/domain/services/ILogger';
import { Comment, CreateCommentData } from '@/domain/entities/Comment';
import { mockUser1 } from '@tests/helpers/mockUsers';
import { mockComment1, mockComment2 } from '@tests/helpers/mockComments';

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
      findById: vi.fn((id: string) => {
        const user = id === mockUser1.id ? mockUser1 : null;
        return Promise.resolve(user);
      }),
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
      const mockComments: Comment[] = [mockComment1, mockComment2];

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
        authorId: mockUser1.id,
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockComment1);

      const result = await commentService.addComment(createData);

      expect(result).toEqual(mockComment1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ticketId: 'ticket-123',
        content: 'Nouveau commentaire',
        authorId: mockUser1.id,
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when ticketId is empty', async () => {
      const createData: CreateCommentData = {
        ticketId: '',
        content: 'Commentaire',
        authorId: mockUser1.id,
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
        authorId: mockUser1.id,
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
        authorId: mockUser1.id,
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
        authorId: mockUser1.id,
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockComment1);

      await commentService.addComment(createData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ticketId: 'ticket-123',
        content: 'Commentaire avec espaces',
        authorId: mockUser1.id,
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when content is only whitespace', async () => {
      const createData: CreateCommentData = {
        ticketId: 'ticket-123',
        content: '   ',
        authorId: mockUser1.id,
      };

      await expect(commentService.addComment(createData)).rejects.toThrow(
        'Le contenu du commentaire est requis'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });
});
