import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket, UpdateTicketData } from '../entities/Ticket';

export class UpdateTicket {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(id: string, data: UpdateTicketData): Promise<Ticket | null> {
    return await this.ticketRepository.update(id, data);
  }
}
