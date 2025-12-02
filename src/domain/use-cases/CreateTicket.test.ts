import { describe, it, expect, vi } from 'vitest';
import { CreateTicket } from './CreateTicket';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { TicketStatus } from '../value-objects/TicketStatus';

describe('CreateTicket', () => {
  const mockRepository: ITicketRepository = {
    findAll: vi.fn(),
    create: vi.fn(),
  };

  it('should create a ticket with valid data', async () => {
    const mockTicket = {
      id: '1',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockTicket);

    const useCase = new CreateTicket(mockRepository);
    const result = await useCase.execute({
      title: 'Test Ticket',
      description: 'Test Description',
    });

    expect(result).toEqual(mockTicket);
    expect(mockRepository.create).toHaveBeenCalledWith({
      title: 'Test Ticket',
      description: 'Test Description',
    });
  });

  it('should trim title and description', async () => {
    const mockTicket = {
      id: '1',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(mockTicket);

    const useCase = new CreateTicket(mockRepository);
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
    const useCase = new CreateTicket(mockRepository);

    await expect(
      useCase.execute({
        title: '',
        description: 'Test Description',
      })
    ).rejects.toThrow('Le titre est requis');
  });

  it('should throw error when title exceeds 200 characters', async () => {
    const useCase = new CreateTicket(mockRepository);

    await expect(
      useCase.execute({
        title: 'A'.repeat(201),
        description: 'Test Description',
      })
    ).rejects.toThrow('Le titre ne doit pas dépasser 200 caractères');
  });

  it('should throw error when description is empty', async () => {
    const useCase = new CreateTicket(mockRepository);

    await expect(
      useCase.execute({
        title: 'Test Title',
        description: '',
      })
    ).rejects.toThrow('La description est requise');
  });

  it('should throw error when description exceeds 5000 characters', async () => {
    const useCase = new CreateTicket(mockRepository);

    await expect(
      useCase.execute({
        title: 'Test Title',
        description: 'A'.repeat(5001),
      })
    ).rejects.toThrow('La description ne doit pas dépasser 5000 caractères');
  });
});
