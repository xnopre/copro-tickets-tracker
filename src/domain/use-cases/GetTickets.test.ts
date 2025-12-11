import { describe, it, expect, vi } from 'vitest';
import { GetTickets } from './GetTickets';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { TicketStatus } from '../value-objects/TicketStatus';

describe('GetTickets', () => {
  const mockRepository: ITicketRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  it('should return all tickets', async () => {
    const mockTickets = [
      {
        id: '1',
        title: 'Ticket 1',
        description: 'Description 1',
        status: TicketStatus.NEW,
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Ticket 2',
        description: 'Description 2',
        status: TicketStatus.IN_PROGRESS,
        assignedTo: 'Jean Martin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(mockRepository.findAll).mockResolvedValue(mockTickets);

    const useCase = new GetTickets(mockRepository);
    const result = await useCase.execute();

    expect(result).toEqual(mockTickets);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no tickets', async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue([]);

    const useCase = new GetTickets(mockRepository);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
