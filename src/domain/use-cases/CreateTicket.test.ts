import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTicket } from './CreateTicket';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IEmailService } from '../services/IEmailService';
import { IEmailTemplateService } from '../services/IEmailTemplateService';
import { ILogger } from '../services/ILogger';
import { TicketStatus } from '../value-objects/TicketStatus';

describe('CreateTicket', () => {
  const mockRepository: ITicketRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
  };

  const mockUserRepository: IUserRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
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

  it('should create a ticket with valid data', async () => {
    const mockTicket = {
      id: '1',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockUsers = [
      {
        id: 'user_1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      },
    ];

    vi.mocked(mockRepository.create).mockResolvedValue(mockTicket);
    vi.mocked(mockUserRepository.findAll).mockResolvedValue(mockUsers);
    vi.mocked(mockEmailService.sendSafe).mockResolvedValue(true);

    const useCase = new CreateTicket(
      mockRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );
    const result = await useCase.execute({
      title: 'Test Ticket',
      description: 'Test Description',
    });

    expect(result).toEqual(mockTicket);
    expect(mockRepository.create).toHaveBeenCalledWith({
      title: 'Test Ticket',
      description: 'Test Description',
    });
    expect(mockEmailService.sendSafe).toHaveBeenCalled();
  });

  it('should trim title and description', async () => {
    const mockTicket = {
      id: '1',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockTicket);
    vi.mocked(mockUserRepository.findAll).mockResolvedValue([]);

    const useCase = new CreateTicket(
      mockRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );
    await useCase.execute({
      title: '  Test Ticket  ',
      description: '  Test Description  ',
    });

    expect(mockRepository.create).toHaveBeenCalledWith({
      title: 'Test Ticket',
      description: 'Test Description',
    });
  });

  it('should throw error when title is empty', async () => {
    const useCase = new CreateTicket(
      mockRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    await expect(
      useCase.execute({
        title: '',
        description: 'Test Description',
      })
    ).rejects.toThrow('Le titre est requis');
  });

  it('should throw error when title exceeds 200 characters', async () => {
    const useCase = new CreateTicket(
      mockRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    await expect(
      useCase.execute({
        title: 'A'.repeat(201),
        description: 'Test Description',
      })
    ).rejects.toThrow('Le titre ne doit pas dépasser 200 caractères');
  });

  it('should throw error when description is empty', async () => {
    const useCase = new CreateTicket(
      mockRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    await expect(
      useCase.execute({
        title: 'Test Title',
        description: '',
      })
    ).rejects.toThrow('La description est requise');
  });

  it('should throw error when description exceeds 5000 characters', async () => {
    const useCase = new CreateTicket(
      mockRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    await expect(
      useCase.execute({
        title: 'Test Title',
        description: 'A'.repeat(5001),
      })
    ).rejects.toThrow('La description ne doit pas dépasser 5000 caractères');
  });

  it('should not fail if email sending fails', async () => {
    const mockTicket = {
      id: '1',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockTicket);
    vi.mocked(mockUserRepository.findAll).mockRejectedValue(new Error('Database error'));

    const useCase = new CreateTicket(
      mockRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    const result = await useCase.execute({
      title: 'Test Ticket',
      description: 'Test Description',
    });

    expect(result).toEqual(mockTicket);
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should not send email if no users exist', async () => {
    const mockTicket = {
      id: '1',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockTicket);
    vi.mocked(mockUserRepository.findAll).mockResolvedValue([]);

    const useCase = new CreateTicket(
      mockRepository,
      mockUserRepository,
      mockEmailService,
      mockEmailTemplateService,
      mockLogger
    );

    await useCase.execute({
      title: 'Test Ticket',
      description: 'Test Description',
    });

    expect(mockEmailService.sendSafe).not.toHaveBeenCalled();
  });
});
