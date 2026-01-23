import { describe, it, expect, vi } from 'vitest';
import { GetTickets } from './GetTickets';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { mockTicketNew, mockTicketInProgress } from '@tests/helpers/mockTickets';

describe('GetTickets', () => {
  const mockRepository: ITicketRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
  };

  it('should return all tickets', async () => {
    const testTickets = [mockTicketNew, mockTicketInProgress];

    vi.mocked(mockRepository.findAll).mockResolvedValue(testTickets);

    const useCase = new GetTickets(mockRepository);
    const result = await useCase.execute();

    expect(result).toEqual(testTickets);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no tickets', async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue([]);

    const useCase = new GetTickets(mockRepository);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
