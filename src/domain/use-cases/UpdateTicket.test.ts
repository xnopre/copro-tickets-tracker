import { describe, it, expect, vi } from 'vitest';
import { UpdateTicket } from './UpdateTicket';
import { ITicketRepository } from '../repositories/ITicketRepository';
import { TicketStatus } from '../value-objects/TicketStatus';
import { UpdateTicketData } from '../entities/Ticket';

describe('UpdateTicket', () => {
  const mockRepository: ITicketRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  it('should update a ticket with valid data', async () => {
    const updateData: UpdateTicketData = {
      status: TicketStatus.IN_PROGRESS,
      assignedTo: 'Jean Dupont',
    };

    const mockUpdatedTicket = {
      id: '1',
      title: "Réparer l'ascenseur",
      description: "L'ascenseur est en panne depuis hier",
      status: TicketStatus.IN_PROGRESS,
      assignedTo: 'Jean Dupont',
      createdAt: new Date('2025-01-01T10:00:00.000Z'),
      updatedAt: new Date('2025-01-15T14:30:00.000Z'),
    };

    vi.mocked(mockRepository.update).mockResolvedValue(mockUpdatedTicket);

    const useCase = new UpdateTicket(mockRepository);
    const result = await useCase.execute('1', updateData);

    expect(result).toEqual(mockUpdatedTicket);
    expect(mockRepository.update).toHaveBeenCalledWith('1', updateData);
  });

  it('should return null when ticket not found', async () => {
    const updateData: UpdateTicketData = {
      status: TicketStatus.RESOLVED,
      assignedTo: 'Marie Martin',
    };

    vi.mocked(mockRepository.update).mockResolvedValue(null);

    const useCase = new UpdateTicket(mockRepository);
    const result = await useCase.execute('non-existent-id', updateData);

    expect(result).toBeNull();
    expect(mockRepository.update).toHaveBeenCalledWith('non-existent-id', updateData);
  });

  it('should update ticket status to RESOLVED', async () => {
    const updateData: UpdateTicketData = {
      status: TicketStatus.RESOLVED,
      assignedTo: 'Pierre Durand',
    };

    const mockUpdatedTicket = {
      id: '2',
      title: "Fuite d'eau",
      description: 'Fuite au 3ème étage',
      status: TicketStatus.RESOLVED,
      assignedTo: 'Pierre Durand',
      createdAt: new Date('2025-01-05T09:00:00.000Z'),
      updatedAt: new Date('2025-01-15T16:00:00.000Z'),
    };

    vi.mocked(mockRepository.update).mockResolvedValue(mockUpdatedTicket);

    const useCase = new UpdateTicket(mockRepository);
    const result = await useCase.execute('2', updateData);

    expect(result).toEqual(mockUpdatedTicket);
    expect(result?.status).toBe(TicketStatus.RESOLVED);
    expect(result?.assignedTo).toBe('Pierre Durand');
  });

  it('should update ticket status to CLOSED', async () => {
    const updateData: UpdateTicketData = {
      status: TicketStatus.CLOSED,
      assignedTo: 'Sophie Bernard',
    };

    const mockUpdatedTicket = {
      id: '3',
      title: 'Lumière cassée',
      description: 'La lumière du hall ne fonctionne plus',
      status: TicketStatus.CLOSED,
      assignedTo: 'Sophie Bernard',
      createdAt: new Date('2025-01-10T11:00:00.000Z'),
      updatedAt: new Date('2025-01-15T17:00:00.000Z'),
    };

    vi.mocked(mockRepository.update).mockResolvedValue(mockUpdatedTicket);

    const useCase = new UpdateTicket(mockRepository);
    const result = await useCase.execute('3', updateData);

    expect(result).toEqual(mockUpdatedTicket);
    expect(result?.status).toBe(TicketStatus.CLOSED);
    expect(result?.assignedTo).toBe('Sophie Bernard');
  });
});
