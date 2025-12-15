import { describe, it, expect, vi } from 'vitest';
import { GetTicketById } from './GetTicketById';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { TicketStatus } from '../value-objects/TicketStatus';

describe('GetTicketById', () => {
  const mockRepository: ITicketRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
  };

  it('should return a ticket when found', async () => {
    const mockTicket = {
      id: '1',
      title: 'Ticket 1',
      description: 'Description 1',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(mockTicket);

    const useCase = new GetTicketById(mockRepository);
    const result = await useCase.execute('1');

    expect(result).toEqual(mockTicket);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should return null when ticket not found', async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const useCase = new GetTicketById(mockRepository);
    const result = await useCase.execute('non-existent-id');

    expect(result).toBeNull();
    expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id');
  });
});
