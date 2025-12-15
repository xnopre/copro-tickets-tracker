import { describe, it, expect, vi } from 'vitest';
import { ArchiveTicket } from './ArchiveTicket';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { TicketStatus } from '../value-objects/TicketStatus';

describe('ArchiveTicket', () => {
  const mockRepository: ITicketRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
  };

  it('should archive a ticket successfully', async () => {
    const mockTicket = {
      id: '1',
      title: 'Test Ticket',
      description: 'Test Description',
      status: TicketStatus.NEW,
      assignedTo: null,
      archived: true,
      createdAt: new Date('2025-01-15T10:00:00.000Z'),
      updatedAt: new Date('2025-01-15T11:00:00.000Z'),
    };

    vi.mocked(mockRepository.archive).mockResolvedValue(mockTicket);

    const useCase = new ArchiveTicket(mockRepository);
    const result = await useCase.execute('1');

    expect(result).toEqual(mockTicket);
    expect(mockRepository.archive).toHaveBeenCalledWith('1');
  });

  it('should return null when ticket is not found', async () => {
    vi.mocked(mockRepository.archive).mockResolvedValue(null);

    const useCase = new ArchiveTicket(mockRepository);
    const result = await useCase.execute('999');

    expect(result).toBeNull();
    expect(mockRepository.archive).toHaveBeenCalledWith('999');
  });
});
