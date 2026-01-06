import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddComment } from './AddComment';
import { ICommentRepository } from '../repositories/ICommentRepository';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IEmailService } from '../services/IEmailService';
import { IEmailTemplateService } from '../services/IEmailTemplateService';
import { ILogger } from '../services/ILogger';
import { TicketStatus } from '../value-objects/TicketStatus';
import { User } from '@/domain/entities/User';

describe('AddComment', () => {
  const mockRepository: ICommentRepository = {
    findByTicketId: vi.fn(),
    create: vi.fn(),
  };

  const mockTicketRepository: ITicketRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
  };

  const mockUserRepository: IUserRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
  };

  const mockEmailService: IEmailService = {
    send: vi.fn(),
    sendSafe: vi.fn(),
  };

  const mockEmailTemplateService: IEmailTemplateService = {
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

  const mockLogger: ILogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a comment with valid data', async () => {
    const mockComment = {
      id: '1',
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: {
        id: 'user-1',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean@example.com',
      },
      createdAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockComment);

    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );
    const result = await useCase.execute({
      ticketId: 'ticket-1',
      content: 'Test comment',
      authorId: 'user-1',
    });

    expect(result).toEqual(mockComment);
    expect(mockRepository.create).toHaveBeenCalledWith({
      ticketId: 'ticket-1',
      content: 'Test comment',
      authorId: 'user-1',
    });
  });

  it('should trim content when creating comment', async () => {
    const mockComment = {
      id: '1',
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: {
        id: 'user-1',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean@example.com',
      },
      createdAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockComment);

    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );
    await useCase.execute({
      ticketId: 'ticket-1',
      content: '  Test comment  ',
      authorId: 'user-1',
    });

    expect(mockRepository.create).toHaveBeenCalledWith({
      ticketId: 'ticket-1',
      content: 'Test comment',
      authorId: 'user-1',
    });
  });

  it('should throw error when ticketId is empty', async () => {
    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    await expect(
      useCase.execute({
        ticketId: '',
        content: 'Test comment',
        authorId: 'user-1',
      })
    ).rejects.toThrow("L'ID du ticket est requis");
  });

  it('should throw error when content is empty', async () => {
    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    await expect(
      useCase.execute({
        ticketId: 'ticket-1',
        content: '',
        authorId: 'user-1',
      })
    ).rejects.toThrow('Le contenu du commentaire est requis');
  });

  it('should throw error when content exceeds 2000 characters', async () => {
    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    await expect(
      useCase.execute({
        ticketId: 'ticket-1',
        content: 'A'.repeat(2001),
        authorId: 'user-1',
      })
    ).rejects.toThrow('Le commentaire ne doit pas dépasser 2000 caractères');
  });

  it('should throw error when authorId is empty', async () => {
    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    await expect(
      useCase.execute({
        ticketId: 'ticket-1',
        content: 'Test comment',
        authorId: '',
      })
    ).rejects.toThrow("L'ID de l'auteur est requis");
  });

  it('should send email notification when comment is added', async () => {
    const mockComment = {
      id: '1',
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: {
        id: 'user-1',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean@example.com',
      },
      createdAt: new Date(),
    };

    const mockTicket = {
      id: 'ticket-1',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockUsers: User[] = [
      {
        id: 'user_1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      },
    ];

    vi.mocked(mockRepository.create).mockResolvedValue(mockComment);
    vi.mocked(mockTicketRepository.findById).mockResolvedValue(mockTicket);
    vi.mocked(mockUserRepository.findAll).mockResolvedValue(mockUsers);
    vi.mocked(mockEmailService.sendSafe).mockResolvedValue(true);

    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );
    await useCase.execute({
      ticketId: 'ticket-1',
      content: 'Test comment',
      authorId: 'user-1',
    });

    expect(mockTicketRepository.findById).toHaveBeenCalledWith('ticket-1');
    expect(mockUserRepository.findAll).toHaveBeenCalled();
    expect(mockEmailService.sendSafe).toHaveBeenCalled();
  });

  it('should not send email if ticket is not found', async () => {
    const mockComment = {
      id: '1',
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: {
        id: 'user-1',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean@example.com',
      },
      createdAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockComment);
    vi.mocked(mockTicketRepository.findById).mockResolvedValue(null);

    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );
    await useCase.execute({
      ticketId: 'ticket-1',
      content: 'Test comment',
      authorId: 'user-1',
    });

    expect(mockTicketRepository.findById).toHaveBeenCalledWith('ticket-1');
    expect(mockEmailService.sendSafe).not.toHaveBeenCalled();
  });

  it('should not send email if no users exist', async () => {
    const mockComment = {
      id: '1',
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: {
        id: 'user-1',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean@example.com',
      },
      createdAt: new Date(),
    };

    const mockTicket = {
      id: 'ticket-1',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockComment);
    vi.mocked(mockTicketRepository.findById).mockResolvedValue(mockTicket);
    vi.mocked(mockUserRepository.findAll).mockResolvedValue([]);

    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );
    await useCase.execute({
      ticketId: 'ticket-1',
      content: 'Test comment',
      authorId: 'user-1',
    });

    expect(mockUserRepository.findAll).toHaveBeenCalled();
    expect(mockEmailService.sendSafe).not.toHaveBeenCalled();
  });

  it('should not fail if email sending fails', async () => {
    const mockComment = {
      id: '1',
      ticketId: 'ticket-1',
      content: 'Test comment',
      author: {
        id: 'user-1',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean@example.com',
      },
      createdAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockComment);
    vi.mocked(mockTicketRepository.findById).mockRejectedValue(new Error('Database error'));

    const useCase = new AddComment(
      mockRepository,
      mockTicketRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    const result = await useCase.execute({
      ticketId: 'ticket-1',
      content: 'Test comment',
      authorId: 'user-1',
    });

    expect(result).toEqual(mockComment);
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
