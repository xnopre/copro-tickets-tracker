import { ITicketRepository } from '../repositories/ITicketRepository';
import { Ticket } from '../entities/Ticket';

export class GetTickets {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(): Promise<Ticket[]> {
    return await this.ticketRepository.findAll();
  }
}
